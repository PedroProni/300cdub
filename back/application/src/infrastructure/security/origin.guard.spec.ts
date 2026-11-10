import { ExecutionContext } from '@nestjs/common';
import { OriginGuard } from '@infrastructure/security/origin.guard';
import { EnvConfigService } from '@common/env/env-config.service';

const guard = new OriginGuard({ getAllowedOrigins: () => ['https://site.test'] } as unknown as EnvConfigService);

function context(method: string, origin?: string): ExecutionContext {
  return { switchToHttp: () => ({ getRequest: () => ({ method, headers: origin ? { origin } : {} }) }) } as unknown as ExecutionContext;
}

describe('OriginGuard', () => {
  it('lets safe methods through from any origin', () => {
    expect(guard.canActivate(context('GET', 'https://evil.test'))).toBe(true);
  });

  it('accepts unsafe methods from an allowed origin', () => {
    expect(guard.canActivate(context('POST', 'https://site.test/'))).toBe(true);
  });

  it('accepts unsafe methods without an Origin header (non browser clients)', () => {
    expect(guard.canActivate(context('DELETE'))).toBe(true);
  });

  it('rejects unsafe methods from a foreign origin', () => {
    expect(() => guard.canActivate(context('PUT', 'https://evil.test'))).toThrow();
  });
});
