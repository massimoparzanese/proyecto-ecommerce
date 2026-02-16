import { Request, Response, NextFunction, RequestHandler } from 'express';
import { verifyToken } from '../utils/jwt';
import userRepository from '../repositories/user';
import { IUserDocument } from '../models/user';

// Middleware: attach `req.user` when token is valid
export const requireAuth: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await getUserFromRequest(req);
    if (!user)
      return res
        .status(401)
        .json({ message: 'No session or invalid token', data: null });
    (req as any).user = user;
    next();
  } catch (err) {
    next(err);
  }
};

// Higher-order wrapper to protect single handlers (decorator-like)
export function withAuth(handler: RequestHandler): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await getUserFromRequest(req);
      if (!user)
        return res
          .status(401)
          .json({ message: 'No session or invalid token', data: null });
      (req as any).user = user;
      return handler(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

export default { requireAuth, withAuth };

async function getUserFromRequest(req: Request): Promise<IUserDocument | null> {
  const token =
    req.cookies?.token || req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const payload = verifyToken<{ id: string }>(token);
  if (!payload || !payload.id) return null;
  const user = await userRepository.getUserById(payload.id);
  return user;
}
