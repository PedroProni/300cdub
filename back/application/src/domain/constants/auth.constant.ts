import { hashSync } from 'bcryptjs';
export const SESSION_COOKIE_NAME = 'cdub_session';
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 72;
export const BCRYPT_ROUNDS = 12;

export const DUMMY_PASSWORD_HASH = hashSync('dummy-password', BCRYPT_ROUNDS);
