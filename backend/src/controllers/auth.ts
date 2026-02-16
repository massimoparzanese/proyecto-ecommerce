import { Request, Response, NextFunction } from 'express';
import userRepository from '../repositories/user';
import { validatePassword, validateEmail } from '../utils/validators';
import { signToken, verifyToken } from '../utils/jwt';
import {
  getUserFromRequest,
  getCookieOptions,
  getUserPublicData,
} from '../utils/auth';
import { ApiResponse } from '../interfaces/response';

// Registrar un nuevo usuario
export const register = async (
  req: Request,
  res: Response<ApiResponse<any>>,
  next: NextFunction
): Promise<Response<ApiResponse<any>>> => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: 'Campos requeridos faltantes', data: null });
    }

    const emailCheck = await validateEmail(email);
    if (!emailCheck.valid) {
      return res.status(400).json({
        message: 'Email inválido',
        data: { reasons: emailCheck.reasons },
      });
    }

    if (role === 'admin') {
      return res.status(403).json({
        message: 'No se puede asignar el rol de administrador',
        data: null,
      });
    }

    const existing = await userRepository.getUserByEmail(email);
    if (existing)
      return res
        .status(409)
        .json({ message: 'El email solicitado está en uso', data: null });

    const pwdResult = validatePassword(password, { email, name });
    if (!pwdResult.valid)
      return res.status(400).json({
        message: 'La contraseña no cumple con los criterios',
        data: { reasons: pwdResult.reasons },
      });

    // crea usuario (el hash se hace en pre-save del modelo)
    const newUser = await userRepository.createUser({
      name,
      email,
      password,
      role,
    });

    // generar JWT y establecer cookie de sesión
    const token = signToken({ id: newUser.id, role: newUser.role });
    const cookieOptions = getCookieOptions();
    res.cookie('token', token, cookieOptions);
    return res.status(201).json({
      message: 'User registered',
      data: getUserPublicData(newUser),
    });
  } catch (err) {
    next(err);
    throw err;
  }
};

// Login (email + password)
export const login = async (
  req: Request,
  res: Response<ApiResponse<any>>,
  next: NextFunction
): Promise<Response<ApiResponse<any>>> => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: 'Campos requeridos faltantes', data: null });

    const user = await userRepository.getUserByEmail(email);
    if (!user)
      return res
        .status(401)
        .json({ message: 'Credenciales inválidas', data: null });

    const match = await user.comparePassword(password);
    if (!match)
      return res
        .status(401)
        .json({ message: 'Credenciales inválidas', data: null });

    const token = signToken({ id: user.id, role: user.role });
    const cookieOptions = getCookieOptions();
    res.cookie('token', token, cookieOptions);
    return res.status(201).json({
      message: 'Usuario autenticado',
      data: getUserPublicData(user),
    });
  } catch (err) {
    next(err);
    throw err;
  }
};

// Logout (invalida cookie/token en cliente)
export const logout = (
  _req: Request,
  res: Response<ApiResponse<any>>
): Response<ApiResponse<any>> => {
  res.clearCookie('token');
  return res.status(200).json({ message: 'Logged out', data: null });
};

// Refresh token (si usas refresh tokens)
export const refreshToken = async (
  req: Request,
  res: Response<ApiResponse<any>>,
  next: NextFunction
): Promise<Response<ApiResponse<any>>> => {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return res.status(401).json({
        message: 'No hay sesión activa o token inválido',
        data: null,
      });
    }

    // Generar nuevo token
    const newToken = signToken({ id: user.id, role: user.role });
    const cookieOptions = getCookieOptions();

    // Establecer nueva cookie
    res.cookie('token', newToken, cookieOptions);

    return res.status(200).json({
      message: 'Token renovado exitosamente',
      data: { expiresIn: '1h' },
    });
  } catch (err) {
    next(err);
    throw err;
  }
};

// Obtener usuario autenticado
export const me = async (
  req: Request,
  res: Response<ApiResponse<any>>,
  next: NextFunction
): Promise<Response<ApiResponse<any>>> => {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return res.status(401).json({
        message: 'No hay sesión activa o token inválido',
        data: null,
      });
    }

    return res.status(200).json({
      message: 'Usuario autenticado',
      data: getUserPublicData(user),
    });
  } catch (err) {
    next(err);
    throw err;
  }
};

export default {
  register,
  login,
  logout,
  refreshToken,
  me,
};
