import { Request, Response, NextFunction } from 'express';
import {
  EquipmentStatus,
  EquipmentType,
  ICreateEquipmentDTO
} from '../dtos/equipment.dto';

const EQUIPMENT_TYPES: readonly EquipmentType[] = [
  'COMPUTADOR',
  'MOUSE',
  'TECLADO',
  'CARGADOR',
  'TELEVISOR',
  'CONTROL_TV'
];
const EQUIPMENT_STATUSES: readonly EquipmentStatus[] = [
  'OPERATIVO',
  'MANTENIMIENTO',
  'FUERA_DE_SERVICIO'
];
const CREATE_FIELDS = new Set([
  'placaSena',
  'codigoActivo',
  'tipo',
  'roomId'
]);
const UPDATE_FIELDS = new Set(['placaSena', 'codigoActivo', 'tipo']);
const FILTER_FIELDS = new Set([
  'roomId',
  'estado',
  'tipo',
  'placaSena',
  'codigoActivo'
]);
const MAX_PLATE_LENGTH = 50;
const MAX_CODE_LENGTH = 100;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const isPlate = (value: unknown): value is string =>
  typeof value === 'string' &&
  value.trim() !== '' &&
  value.trim().length <= MAX_PLATE_LENGTH;

const isCode = (value: unknown): value is string =>
  typeof value === 'string' &&
  value.trim() !== '' &&
  value.trim().length <= MAX_CODE_LENGTH;

const isType = (value: unknown): value is EquipmentType =>
  typeof value === 'string' && EQUIPMENT_TYPES.includes(value as EquipmentType);

const isStatus = (value: unknown): value is EquipmentStatus =>
  typeof value === 'string' &&
  EQUIPMENT_STATUSES.includes(value as EquipmentStatus);

const isUuid = (value: unknown): value is string =>
  typeof value === 'string' && UUID_PATTERN.test(value);

const isCreateEquipmentDTO = (value: unknown): value is ICreateEquipmentDTO => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const equipment = value as Record<string, unknown>;
  return (
    Object.keys(equipment).every((key) => CREATE_FIELDS.has(key)) &&
    isPlate(equipment.placaSena) &&
    isCode(equipment.codigoActivo) &&
    isType(equipment.tipo) &&
    isUuid(equipment.roomId)
  );
};

const isUpdateEquipmentDTO = (value: unknown): boolean => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const equipment = value as Record<string, unknown>;
  const keys = Object.keys(equipment);
  return (
    keys.length > 0 &&
    keys.every((key) => UPDATE_FIELDS.has(key)) &&
    (equipment.placaSena === undefined || isPlate(equipment.placaSena)) &&
    (equipment.codigoActivo === undefined || isCode(equipment.codigoActivo)) &&
    (equipment.tipo === undefined || isType(equipment.tipo))
  );
};

const isUpdateStatusDTO = (
  value: unknown
): value is { estado: EquipmentStatus } => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const body = value as Record<string, unknown>;
  const keys = Object.keys(body);
  return keys.length === 1 && keys[0] === 'estado' && isStatus(body.estado);
};

const isMoveDTO = (value: unknown): value is { roomId: string } => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const body = value as Record<string, unknown>;
  const keys = Object.keys(body);
  return keys.length === 1 && keys[0] === 'roomId' && isUuid(body.roomId);
};

const reject = (res: Response, error: string): void => {
  res.status(400).json({
    success: false,
    error
  });
};

export const validateEquipmentPayload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;
  if (!isCreateEquipmentDTO(body)) {
    reject(res, 'Datos del equipo inválidos.');
    return;
  }
  next();
};

export const validateEquipmentUpdatePayload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;
  if (!isUpdateEquipmentDTO(body)) {
    reject(res, 'Datos de actualización del equipo inválidos.');
    return;
  }
  next();
};

export const validateEquipmentStatusPayload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;
  if (!isUpdateStatusDTO(body)) {
    reject(res, 'El estado del equipo no es válido.');
    return;
  }
  next();
};

export const validateEquipmentMovePayload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;
  if (!isMoveDTO(body)) {
    reject(res, 'El ambiente de destino debe ser un UUID válido.');
    return;
  }
  next();
};

export const validateEquipmentFilters = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { roomId, estado, tipo, placaSena, codigoActivo } = req.query;
  if (
    !Object.keys(req.query).every((key) => FILTER_FIELDS.has(key)) ||
    (roomId !== undefined && !isUuid(roomId)) ||
    (estado !== undefined && !isStatus(estado)) ||
    (tipo !== undefined && !isType(tipo)) ||
    (placaSena !== undefined && typeof placaSena !== 'string') ||
    (codigoActivo !== undefined && typeof codigoActivo !== 'string')
  ) {
    reject(res, 'Filtros del equipo inválidos.');
    return;
  }
  next();
};

export const validateEquipmentIdParam = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { id } = req.params;
  if (!isUuid(id)) {
    reject(res, 'El identificador del equipo debe ser un UUID válido.');
    return;
  }
  next();
};
