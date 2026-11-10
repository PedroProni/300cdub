import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AppError } from '@common/helpers/app-error';
import { SessionService } from '@infrastructure/security/session.service';
import { AdminRepository } from '@infrastructure/database/repositories/admin.repository';
import { AUTHENTICATED_ADMIN_KEY, IS_PUBLIC_KEY } from '@infrastructure/security/security.constants';
import { ErrorCode } from '@domain/enums/error-code.enum';
import { SESSION_COOKIE_NAME } from '@domain/constants/auth.constant';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly sessions: SessionService,
    private readonly admins: AdminRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
    if (isPublic) return true;
    const request = context.switchToHttp().getRequest<Request>();
    const token = (request.cookies as Record<string, string> | undefined)?.[SESSION_COOKIE_NAME];
    const payload = token ? await this.sessions.verify(token) : null;
    const admin = payload ? await this.findValidAdmin(payload.sub, payload.iat) : null;
    if (!admin) throw new AppError(ErrorCode.Unauthorized, 'Authentication required', HttpStatus.UNAUTHORIZED);
    (request as unknown as Record<string, unknown>)[AUTHENTICATED_ADMIN_KEY] = { id: String(admin._id), email: admin.email };
    return true;
  }

  private async findValidAdmin(id: string, issuedAtSeconds: number) {
    if (!/^[a-f\d]{24}$/i.test(id)) return null;
    const admin = await this.admins.findById(id);
    if (!admin) return null;
    const changedAtSeconds = Math.floor(admin.passwordChangedAt.getTime() / 1000);
    return issuedAtSeconds >= changedAtSeconds ? admin : null;
  }
}
