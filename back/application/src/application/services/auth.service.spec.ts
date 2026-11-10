import { errorWithCode } from '@application/services/error-code.matcher';
import { hashSync } from 'bcryptjs';
import { AuthService } from '@application/services/auth.service';
import { AdminRepository } from '@infrastructure/database/repositories/admin.repository';
import { ErrorCode } from '@domain/enums/error-code.enum';

const PASSWORD_HASH = hashSync('current-password-1', 4);
const ADMIN = { _id: 'a1', email: 'admin@site.test', passwordHash: PASSWORD_HASH };

function build(admin: typeof ADMIN | null) {
  const admins = { findByEmail: jest.fn().mockResolvedValue(admin), findById: jest.fn().mockResolvedValue(admin), updatePassword: jest.fn().mockResolvedValue(undefined) };
  return { service: new AuthService(admins as unknown as AdminRepository), admins };
}

describe('AuthService', () => {
  it('logs in with the right credentials and normalizes the email', async () => {
    const { service, admins } = build(ADMIN);
    await expect(service.login('  Admin@Site.Test ', 'current-password-1')).resolves.toEqual({ id: 'a1', email: 'admin@site.test' });
    expect(admins.findByEmail).toHaveBeenCalledWith('admin@site.test');
  });

  it('rejects a wrong password and an unknown email with the same error', async () => {
    await expect(build(ADMIN).service.login('admin@site.test', 'nope')).rejects.toMatchObject(errorWithCode(ErrorCode.InvalidCredentials));
    await expect(build(null).service.login('ghost@site.test', 'current-password-1')).rejects.toMatchObject(errorWithCode(ErrorCode.InvalidCredentials));
  });

  it('changes the password storing a new hash', async () => {
    const { service, admins } = build(ADMIN);
    await service.changePassword('a1', 'current-password-1', 'brand-new-password-2');
    const [id, newHash] = admins.updatePassword.mock.calls[0];
    expect(id).toBe('a1');
    expect(newHash).not.toBe(PASSWORD_HASH);
  });

  it('refuses a wrong current password and a repeated password', async () => {
    const { service, admins } = build(ADMIN);
    await expect(service.changePassword('a1', 'wrong', 'brand-new-password-2')).rejects.toMatchObject(errorWithCode(ErrorCode.WrongCurrentPassword));
    await expect(service.changePassword('a1', 'current-password-1', 'current-password-1')).rejects.toMatchObject(errorWithCode(ErrorCode.SamePassword));
    expect(admins.updatePassword).not.toHaveBeenCalled();
  });
});
