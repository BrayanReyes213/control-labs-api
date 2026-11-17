import { Request, Response, NextFunction } from 'express';
import { ICreateRoomDTO, RoomStatus } from '../dtos/room.dto';

const ROOM_STATUSES: readonly RoomStatus[] = [
  'OPERATIVO',
  'MANTENIMIENTO',
  'INACTIVO'
];
const ROOM_FIELDS = new Set(['nombre', 'bloque', 'capacidadPcs']);
const FILTER_FIELDS = new Set(['nombre', 'bloque', 'estado']);
const MAX_NAME_LENGTH = 100;
const MAX_BLOCK_LENGTH = 50;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const isName = (value: unknown): value is string =>
  typeof value === 'string' &&
  value.trim() !== '' &&
  value.trim().length <= MAX_NAME_LENGTH;

const isBlock = (value: unknown): value is string =>
  typeof value === 'string' &&
  value.trim() !== '' &&
  value.trim().length <= MAX_BLOCK_LENGTH;

const isCapacity = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0;

const isStatus = (value: unknown): value is RoomStatus =>
  typeof value === 'string' && ROOM_STATUSES.includes(value as RoomStatus);

const isCreateRoomDTO = (value: unknown): value is ICreateRoomDTO => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const room = value as Record<string, unknown>;
  return (
    Object.keys(room).every((key) => ROOM_FIELDS.has(key)) &&
    isName(room.nombre) &&
    isBlock(room.bloque) &&
    isCapacity(room.capacidadPcs)
  );
};

const isUpdateRoomDTO = (value: unknown): boolean => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const room = value as Record<string, unknown>;
  const keys = Object.keys(room);
  return (
    keys.length > 0 &&
    keys.every((key) => ROOM_FIELDS.has(key)) &&
    (room.nombre === undefined || isName(room.nombre)) &&
    (room.bloque === undefined || isBlock(room.bloque)) &&
    (room.capacidadPcs === undefined || isCapacity(room.capacidadPcs))
  );
};

const isUpdateRoomStatusDTO = (
  value: unknown
): value is { estado: RoomStatus } => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const body = value as Record<string, unknown>;
  const keys = Object.keys(body);
  return keys.length === 1 && keys[0] === 'estado' && isStatus(body.estado);
};

const reject = (res: Response, error: string): void => {
  res.status(400).json({
    success: false,
    error
  });
};

export const validateRoomPayload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;
  if (!isCreateRoomDTO(body)) {
    reject(res, 'Datos del ambiente inválidos.');
    return;
  }
  next();
};

export const validateRoomUpdatePayload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;
  if (!isUpdateRoomDTO(body)) {
    reject(res, 'Datos de actualización del ambiente inválidos.');
    return;
  }
  next();
};

export const validateRoomStatusPayload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;
  if (!isUpdateRoomStatusDTO(body)) {
    reject(res, 'El estado debe ser OPERATIVO, MANTENIMIENTO o INACTIVO.');
    return;
  }
  next();
};

export const validateRoomFilters = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { nombre, bloque, estado } = req.query;
  if (
    !Object.keys(req.query).every((key) => FILTER_FIELDS.has(key)) ||
    (nombre !== undefined && typeof nombre !== 'string') ||
    (bloque !== undefined && typeof bloque !== 'string') ||
    (estado !== undefined && !isStatus(estado))
  ) {
    reject(res, 'Filtros del ambiente inválidos.');
    return;
  }
  next();
};

export const validateRoomIdParam = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { id } = req.params;
  if (typeof id !== 'string' || !UUID_PATTERN.test(id)) {
    reject(res, 'El identificador del ambiente debe ser un UUID válido.');
    return;
  }
  next();
};
