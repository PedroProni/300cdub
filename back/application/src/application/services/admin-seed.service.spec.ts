import { AdminSeedService } from '@application/services/admin-seed.service';
import { EnvConfigService } from '@common/env/env-config.service';
import { AdminRepository } from '@infrastructure/database/repositories/admin.repository';

function build(count: number, email: string, password: string) {
  const admins = { count: jest.fn().mockResolvedValue(count), create: jest.fn().mockResolvedValue(undefined) };
  const env = { getAdminEmail: () => email, getAdminPassword: () => password };
  const service = new AdminSeedService(env as unknown as EnvConfigService, admins as unknown as AdminRepository);
  return { service, admins };
}

describe('AdminSeedService', () => {
  it('creates the admin with a hashed password when none exists', async () => {
    const { service, admins } = build(0, 'admin@site.test', 'a-long-enough-password');
    await service.onModuleInit();
    expect(admins.create).toHaveBeenCalledTimes(1);
    const [email, passwordHash] = admins.create.mock.calls[0];
    expect(email).toBe('admin@site.test');
    expect(passwordHash).not.toBe('a-long-enough-password');
    expect(passwordHash).toMatch(/^\$2[aby]\$/);
  });

  it('does nothing when an admin already exists', async () => {
    const { service, admins } = build(1, 'admin@site.test', 'a-long-enough-password');
    await service.onModuleInit();
    expect(admins.create).not.toHaveBeenCalled();
  });

  it('does not create an admin with a short password or empty email', async () => {
    const short = build(0, 'admin@site.test', 'short');
    await short.service.onModuleInit();
    expect(short.admins.create).not.toHaveBeenCalled();
    const noEmail = build(0, '', 'a-long-enough-password');
    await noEmail.service.onModuleInit();
    expect(noEmail.admins.create).not.toHaveBeenCalled();
  });
});
