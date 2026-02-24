import jwt, {
  type JwtPayload,
  type Secret,
  type SignOptions,
} from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
if (!JWT_SECRET) {
  // warn at startup; callers will throw if they try to sign/verify
  console.warn('JWT_SECRET is not set. JWT operations will fail at runtime.');
}

export function signToken(
  payload: object,
  expiresIn: number = 60 * 60
): string {
  if (!JWT_SECRET) throw new Error('Missing JWT_SECRET');
  // ensure payload is a serializable plain object (JwtPayload)
  const secret = JWT_SECRET as Secret;
  const opts: SignOptions = { expiresIn, algorithm: 'HS256' };
  return jwt.sign(payload as JwtPayload, secret, opts);
}

export function verifyToken<T = any>(token: string): T | null {
  if (!JWT_SECRET) throw new Error('Missing JWT_SECRET');
  try {
    return jwt.verify(token, JWT_SECRET) as T;
  } catch (err) {
    return null;
  }
}

export default { signToken, verifyToken };
