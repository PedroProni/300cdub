import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Types } from 'mongoose';
import { AuthGuard } from '@infrastructure/security/auth.guard';
import { SessionService } from '@infrastructure/security/session.service';
import { AdminRepository } from '@infrastructure/database/repositories/admin.repository';
import { IS_PUBLIC_KEY } from '@infrastructure/security/security.constants';

const id = new Types.ObjectId();
const changedAt = new Date('2026-01-01T00:00:10Z');

function build(options: { isPublic?: boolean; payload?: { sub: string; iat: number } | null; admin?: boolean }) {
  const reflector = { getAllAndOverride: (key: string) => (key === IS_PUBLIC_KEY ? options.isPublic : undefined) } as unknown as Reflector;
  const sessions = { verify: async () => options.payload ?? null } as unknown as SessionService;
  const admins = { findById: async () => (options.admin === false ? null : { _id: id, email: 'a@b.c', passwordChangedAt: changedAt }) } as unknown as AdminRepository;
  return new AuthGuard(reflector, sessions, admins);
}

function context(cookies: Record<string, string> = {}): ExecutionContext {
  return { getHandler: () => null, getClass: () => null, switchToHttp: () => ({ getRequest: () => ({ cookies }) }) } as unknown as ExecutionContext;
}

describe('AuthGuard', () => {
  const issued = Math.floor(changedAt.getTime() / 1000) + 5;

  it('lets public routes through without a session', async () => {
    expect(await build({ isPublic: true }).canActivate(context())).toBe(true);
  });

  it('denies by default without a cookie', async () => {
    await expect(build({}).canActivate(context())).rejects.toBeDefined();
  });

  it('denies an invalid token', async () => {
    await expect(build({ payload: null }).canActivate(context({ cdub_session: 'x' }))).rejects.toBeDefined();
  });

  it('accepts a valid session', async () => {
    expect(await build({ payload: { sub: String(id), iat: issued } }).canActivate(context({ cdub_session: 'x' }))).toBe(true);
  });

  it('denies a token issued before the last password change', async () => {
    const old = Math.floor(changedAt.getTime() / 1000) - 60;
    await expect(build({ payload: { sub: String(id), iat: old } }).canActivate(context({ cdub_session: 'x' }))).rejects.toBeDefined();
  });

  it('denies a token whose admin no longer exists or has a bad id', async () => {
    await expect(build({ payload: { sub: String(id), iat: issued }, admin: false }).canActivate(context({ cdub_session: 'x' }))).rejects.toBeDefined();
    await expect(build({ payload: { sub: 'not-an-id', iat: issued } }).canActivate(context({ cdub_session: 'x' }))).rejects.toBeDefined();
  });
});
