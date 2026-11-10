import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedAdmin } from '@domain/types/authenticated-admin.type';
import { AUTHENTICATED_ADMIN_KEY } from '@infrastructure/security/security.constants';

export const CurrentAdmin = createParamDecorator((_: unknown, context: ExecutionContext): AuthenticatedAdmin => {
  const request = context.switchToHttp().getRequest<Record<string, unknown>>();
  return request[AUTHENTICATED_ADMIN_KEY] as AuthenticatedAdmin;
});
