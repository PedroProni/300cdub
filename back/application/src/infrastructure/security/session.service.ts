import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CookieOptions, Response } from 'express';
import { EnvConfigService } from '@common/env/env-config.service';
import { SessionPayload } from '@domain/types/session-payload.type';
import { SESSION_COOKIE_NAME, SESSION_TTL_SECONDS } from '@domain/constants/auth.constant';

@Injectable()
export class SessionService {
  constructor(
    private readonly jwt: JwtService,
    private readonly env: EnvConfigService,
  ) {}

  async open(res: Response, adminId: string, email: string): Promise<void> {
    const token = await this.jwt.signAsync({ sub: adminId, email }, { expiresIn: SESSION_TTL_SECONDS });
    res.cookie(SESSION_COOKIE_NAME, token, this.cookieOptions(SESSION_TTL_SECONDS * 1000));
  }

  close(res: Response): void {
    res.clearCookie(SESSION_COOKIE_NAME, this.cookieOptions());
  }

  async verify(token: string): Promise<SessionPayload | null> {
    try {
      return await this.jwt.verifyAsync<SessionPayload>(token);
    } catch {
      return null;
    }
  }

  private cookieOptions(maxAge?: number): CookieOptions {
    return { httpOnly: true, sameSite: 'strict', secure: this.env.isCookieSecure(), path: '/', ...(maxAge ? { maxAge } : {}) };
  }
}
