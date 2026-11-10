import { HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { AppError } from '@common/helpers/app-error';
import { ErrorCode } from '@domain/enums/error-code.enum';

@Injectable()
export class ObjectIdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (typeof value !== 'string' || !/^[a-f\d]{24}$/i.test(value) || !isValidObjectId(value)) {
      throw new AppError(ErrorCode.InvalidId, 'Invalid id', HttpStatus.BAD_REQUEST);
    }
    return value;
  }
}
