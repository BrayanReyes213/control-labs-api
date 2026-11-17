"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRoomIdParam = exports.validateRoomFilters = exports.validateRoomStatusPayload = exports.validateRoomUpdatePayload = exports.validateRoomPayload = void 0;
const ROOM_STATUSES = [
    'OPERATIVO',
    'MANTENIMIENTO',
    'INACTIVO'
];
const ROOM_FIELDS = new Set(['nombre', 'bloque', 'capacidadPcs']);
const FILTER_FIELDS = new Set(['nombre', 'bloque', 'estado']);
const MAX_NAME_LENGTH = 100;
const MAX_BLOCK_LENGTH = 50;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isName = (value) => typeof value === 'string' &&
    value.trim() !== '' &&
    value.trim().length <= MAX_NAME_LENGTH;
const isBlock = (value) => typeof value === 'string' &&
    value.trim() !== '' &&
    value.trim().length <= MAX_BLOCK_LENGTH;
const isCapacity = (value) => typeof value === 'number' && Number.isInteger(value) && value >= 0;
const isStatus = (value) => typeof value === 'string' && ROOM_STATUSES.includes(value);
const isCreateRoomDTO = (value) => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return false;
    }
    const room = value;
    return (Object.keys(room).every((key) => ROOM_FIELDS.has(key)) &&
        isName(room.nombre) &&
        isBlock(room.bloque) &&
        isCapacity(room.capacidadPcs));
};
const isUpdateRoomDTO = (value) => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return false;
    }
    const room = value;
    const keys = Object.keys(room);
    return (keys.length > 0 &&
        keys.every((key) => ROOM_FIELDS.has(key)) &&
        (room.nombre === undefined || isName(room.nombre)) &&
        (room.bloque === undefined || isBlock(room.bloque)) &&
        (room.capacidadPcs === undefined || isCapacity(room.capacidadPcs)));
};
const isUpdateRoomStatusDTO = (value) => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return false;
    }
    const body = value;
    const keys = Object.keys(body);
    return keys.length === 1 && keys[0] === 'estado' && isStatus(body.estado);
};
const reject = (res, error) => {
    res.status(400).json({
        success: false,
        error
    });
};
const validateRoomPayload = (req, res, next) => {
    const body = req.body;
    if (!isCreateRoomDTO(body)) {
        reject(res, 'Datos del ambiente inválidos.');
        return;
    }
    next();
};
exports.validateRoomPayload = validateRoomPayload;
const validateRoomUpdatePayload = (req, res, next) => {
    const body = req.body;
    if (!isUpdateRoomDTO(body)) {
        reject(res, 'Datos de actualización del ambiente inválidos.');
        return;
    }
    next();
};
exports.validateRoomUpdatePayload = validateRoomUpdatePayload;
const validateRoomStatusPayload = (req, res, next) => {
    const body = req.body;
    if (!isUpdateRoomStatusDTO(body)) {
        reject(res, 'El estado debe ser OPERATIVO, MANTENIMIENTO o INACTIVO.');
        return;
    }
    next();
};
exports.validateRoomStatusPayload = validateRoomStatusPayload;
const validateRoomFilters = (req, res, next) => {
    const { nombre, bloque, estado } = req.query;
    if (!Object.keys(req.query).every((key) => FILTER_FIELDS.has(key)) ||
        (nombre !== undefined && typeof nombre !== 'string') ||
        (bloque !== undefined && typeof bloque !== 'string') ||
        (estado !== undefined && !isStatus(estado))) {
        reject(res, 'Filtros del ambiente inválidos.');
        return;
    }
    next();
};
exports.validateRoomFilters = validateRoomFilters;
const validateRoomIdParam = (req, res, next) => {
    const { id } = req.params;
    if (typeof id !== 'string' || !UUID_PATTERN.test(id)) {
        reject(res, 'El identificador del ambiente debe ser un UUID válido.');
        return;
    }
    next();
};
exports.validateRoomIdParam = validateRoomIdParam;
