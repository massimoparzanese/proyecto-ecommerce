import { Request } from 'express';
import { verifyToken } from './jwt';
import userRepository from '../repositories/user';
import { IUserDocument } from '../models/user';
import { NODE_ENV } from '../config';

const DURATION_COOKIE = 1000 * 60 * 60; // 1 hour

// A futuro, añadirle más validaciones (ej. token revocado, usuario deshabilitado, cantidad de peticiones, etc.)
export async function getUserFromRequest(
  req: Request
): Promise<IUserDocument | null> {
  const token =
    req.cookies?.token || req.headers.authorization?.replace(/^Bearer\s+/i, '');

  if (!token) return null;

  const payload = verifyToken<{ id: string; role?: string }>(token);
  if (!payload || !payload.id) return null;

  const user = await userRepository.getUserById(payload.id);
  return user;
}

export function getCookieOptions() {
  return {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: DURATION_COOKIE,
  };
}

export function getUserPublicData(user: IUserDocument) {
  return {
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export default {
  getUserFromRequest,
  getCookieOptions,
  getUserPublicData,
};
