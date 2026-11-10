import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import { ErrorCode } from '@domain/enums/error-code.enum';
import { INTERNAL_ERROR_MESSAGE, STATUS_CODES } from '@domain/constants/http-status.constant';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const res = host.switchToHttp().getResponse<Response>();
    if (!(exception instanceof HttpException)) {
      this.logger.error(exception instanceof Error ? exception.stack : String(exception));
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, code: ErrorCode.Internal, message: INTERNAL_ERROR_MESSAGE });
      return;
    }
    const status = exception.getStatus();
    const body = exception.getResponse();
    const payload = typeof body === 'object' ? (body as Record<string, unknown>) : { message: body };
    const message = Array.isArray(payload.message) ? payload.message.join('; ') : payload.message;
    const code = (payload.code as string | undefined) ?? STATUS_CODES[status] ?? ErrorCode.ValidationFailed;
    res.status(status).json({ statusCode: status, code, message: message ?? exception.message });
  }
}
