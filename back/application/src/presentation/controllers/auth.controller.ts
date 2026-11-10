import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put, Res, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Response } from 'express';
import { AuthService } from '@application/services/auth.service';
import { SessionService } from '@infrastructure/security/session.service';
import { Public } from '@infrastructure/security/public.decorator';
import { CurrentAdmin } from '@infrastructure/security/current-admin.decorator';
import { LoginDto } from '@presentation/dtos/login.dto';
import { ChangePasswordDto } from '@presentation/dtos/change-password.dto';
import { AuthenticatedAdmin } from '@domain/types/authenticated-admin.type';
import { LOGIN_THROTTLE_LIMIT, LOGIN_THROTTLE_TTL_MS, THROTTLER_NAME } from '@domain/constants/throttle.constant';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly sessions: SessionService,
  ) {}

  @Public()
  @UseGuards(ThrottlerGuard)
  @Throttle({ [THROTTLER_NAME]: { limit: LOGIN_THROTTLE_LIMIT, ttl: LOGIN_THROTTLE_TTL_MS } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const admin = await this.auth.login(dto.email, dto.password);
    await this.sessions.open(res, admin.id, admin.email);
    return { user: admin };
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Res({ passthrough: true }) res: Response): void {
    this.sessions.close(res);
  }

  @Get('me')
  me(@CurrentAdmin() admin: AuthenticatedAdmin) {
    return { user: admin };
  }

  @Put('password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async changePassword(@CurrentAdmin() admin: AuthenticatedAdmin, @Body() dto: ChangePasswordDto, @Res({ passthrough: true }) res: Response): Promise<void> {
    await this.auth.changePassword(admin.id, dto.currentPassword, dto.newPassword);
    await this.sessions.open(res, admin.id, admin.email);
  }
}
