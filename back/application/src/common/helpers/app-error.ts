import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@domain/enums/error-code.enum';

export class AppError extends HttpException {
  constructor(code: ErrorCode, message: string, status: HttpStatus) {
    super({ statusCode: status, code, message }, status);
  }
}
