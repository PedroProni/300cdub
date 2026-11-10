import { HttpException } from '@nestjs/common';
import { ErrorCode } from '@domain/enums/error-code.enum';

export function errorWithCode(code: ErrorCode): { getResponse: () => unknown } {
  return expect.objectContaining({ response: expect.objectContaining({ code }) }) as { getResponse: () => unknown } & HttpException;
}
