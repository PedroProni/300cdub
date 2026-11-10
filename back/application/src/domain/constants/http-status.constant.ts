import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@domain/enums/error-code.enum';

export const INTERNAL_ERROR_MESSAGE = 'Internal server error';

export const STATUS_CODES: Record<number, ErrorCode> = {
  [HttpStatus.BAD_REQUEST]: ErrorCode.ValidationFailed,
  [HttpStatus.UNAUTHORIZED]: ErrorCode.Unauthorized,
  [HttpStatus.FORBIDDEN]: ErrorCode.InvalidOrigin,
  [HttpStatus.NOT_FOUND]: ErrorCode.NotFound,
  [HttpStatus.PAYLOAD_TOO_LARGE]: ErrorCode.ImageTooLarge,
  [HttpStatus.TOO_MANY_REQUESTS]: ErrorCode.TooManyRequests,
};
