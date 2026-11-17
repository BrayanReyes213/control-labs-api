import { Request, Response, NextFunction } from 'express';
import { ICreateUserDTO, UserRole } from '../dtos/user.dto';

const USER_ROLES: readonly UserRole[] = ['ADMIN', 'GUARDA', 'INSTRUCTOR'];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USER_FIELDS = new Set(['nombre', 'email', 'rol']);
const MAX_NAME_LENGTH = 150;
const MAX_EMAIL_LENGTH = 255;

const isName = (value: unknown): value is string =>
  typeof value === 'string' &&
  value.trim() !== '' &&
  value.trim().length <= MAX_NAME_LENGTH;

const isEmail = (value: unknown): value is string =>
  typeof value === 'string' &&
  value.trim().length <= MAX_EMAIL_LENGTH &&
  EMAIL_PATTERN.test(value.trim());

const isUserRole = (value: unknown): value is UserRole =>
  typeof value === 'string' && USER_ROLES.includes(value as UserRole);

const isCreateUserDTO = (value: unknown): value is ICreateUserDTO => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const user = value as Record<string, unknown>;
  return (
    Object.keys(user).every((key) => USER_FIELDS.has(key)) &&
    isName(user.nombre) &&
    isEmail(user.email) &&
    isUserRole(user.rol)
  );
};

const isUpdateUserDTO = (value: unknown): boolean => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const user = value as Record<string, unknown>;
  const keys = Object.keys(user);
  return (
    keys.length > 0 &&
    keys.every((key) => USER_FIELDS.has(key)) &&
    (user.nombre === undefined || isName(user.nombre)) &&
    (user.email === undefined || isEmail(user.email)) &&
    (user.rol === undefined || isUserRole(user.rol))
  );
};

const isUpdateUserActiveDTO = (
  value: unknown
): value is { activo: boolean } => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const body = value as Record<string, unknown>;
  const keys = Object.keys(body);
  return (
    keys.length === 1 &&
    keys[0] === 'activo' &&
    typeof body.activo === 'boolean'
  );
};

export const validateUserPayload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;
  if (!isCreateUserDTO(body)) {
    res.status(400).json({
      success: false,
      error: 'Datos del usuario inválidos.'
    });
    return;
  }
  next();
};

export const validateUserUpdatePayload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;
  if (!isUpdateUserDTO(body)) {
    res.status(400).json({
      success: false,
      error: 'Datos de actualización del usuario inválidos.'
    });
    return;
  }
  next();
};

export const validateUserActivePayload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;
  if (!isUpdateUserActiveDTO(body)) {
    res.status(400).json({
      success: false,
      error: 'El campo activo debe ser un booleano.'
    });
    return;
  }
  next();
};
