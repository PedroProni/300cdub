import { HttpStatus, Injectable } from '@nestjs/common';
import { compare, hash, hashSync } from 'bcryptjs';
import { AppError } from '@common/helpers/app-error';
import { AdminRepository } from '@infrastructure/database/repositories/admin.repository';
import { AuthenticatedAdmin } from '@domain/types/authenticated-admin.type';
import { ErrorCode } from '@domain/enums/error-code.enum';
import { BCRYPT_ROUNDS } from '@domain/constants/auth.constant';

const DUMMY_HASH = hashSync('dummy-password', BCRYPT_ROUNDS);

@Injectable()
export class AuthService {
  constructor(private readonly admins: AdminRepository) {}

  async login(email: string, password: string): Promise<AuthenticatedAdmin> {
    const admin = await this.admins.findByEmail(email.trim().toLowerCase());
    const valid = await compare(password, admin?.passwordHash ?? DUMMY_HASH);
    if (!admin || !valid) throw new AppError(ErrorCode.InvalidCredentials, 'Invalid email or password', HttpStatus.UNAUTHORIZED);
    return { id: String(admin._id), email: admin.email };
  }

  async changePassword(adminId: string, currentPassword: string, newPassword: string): Promise<void> {
    const admin = await this.admins.findById(adminId);
    if (!admin || !(await compare(currentPassword, admin.passwordHash))) {
      throw new AppError(ErrorCode.WrongCurrentPassword, 'Current password is incorrect', HttpStatus.BAD_REQUEST);
    }
    if (currentPassword === newPassword) {
      throw new AppError(ErrorCode.SamePassword, 'New password must differ from the current one', HttpStatus.BAD_REQUEST);
    }
    await this.admins.updatePassword(adminId, await hash(newPassword, BCRYPT_ROUNDS));
  }
}
