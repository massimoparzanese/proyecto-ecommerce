import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config'; // Assuming you have a config file for environment variables
import userRepository from '../repositories/user';
const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: 'No autorizado: No se proporcionó un token' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const userId = decoded.id;

    const user = await userRepository.getUserById(userId);

    if (!user || user.role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'Prohibido: Solo para administradores' });
    }

    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al verificar el rol de administrador', error });
  }
};

export default requireAdmin;
