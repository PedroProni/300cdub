import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AppError } from '@common/helpers/app-error';
import { EnvConfigService } from '@common/env/env-config.service';
import { UNSAFE_METHODS } from '@infrastructure/security/security.constants';
import { ErrorCode } from '@domain/enums/error-code.enum';

@Injectable()
export class OriginGuard implements CanActivate {
  constructor(private readonly env: EnvConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    if (!UNSAFE_METHODS.includes(request.method)) return true;
    const origin = request.headers.origin;
    if (!origin) return true;
    if (this.env.getAllowedOrigins().includes(origin.replace(/\/$/, ''))) return true;
    throw new AppError(ErrorCode.InvalidOrigin, 'Origin not allowed', HttpStatus.FORBIDDEN);
  }
}
