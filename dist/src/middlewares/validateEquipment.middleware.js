"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEquipmentIdParam = exports.validateEquipmentFilters = exports.validateEquipmentMovePayload = exports.validateEquipmentStatusPayload = exports.validateEquipmentUpdatePayload = exports.validateEquipmentPayload = void 0;
const EQUIPMENT_TYPES = [
    'COMPUTADOR',
    'MOUSE',
    'TECLADO',
    'CARGADOR',
    'TELEVISOR',
    'CONTROL_TV'
];
const EQUIPMENT_STATUSES = [
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
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isPlate = (value) => typeof value === 'string' &&
    value.trim() !== '' &&
    value.trim().length <= MAX_PLATE_LENGTH;
const isCode = (value) => typeof value === 'string' &&
    value.trim() !== '' &&
    value.trim().length <= MAX_CODE_LENGTH;
const isType = (value) => typeof value === 'string' && EQUIPMENT_TYPES.includes(value);
const isStatus = (value) => typeof value === 'string' &&
    EQUIPMENT_STATUSES.includes(value);
const isUuid = (value) => typeof value === 'string' && UUID_PATTERN.test(value);
const isCreateEquipmentDTO = (value) => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return false;
    }
    const equipment = value;
    return (Object.keys(equipment).every((key) => CREATE_FIELDS.has(key)) &&
        isPlate(equipment.placaSena) &&
        isCode(equipment.codigoActivo) &&
        isType(equipment.tipo) &&
        isUuid(equipment.roomId));
};
const isUpdateEquipmentDTO = (value) => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return false;
    }
    const equipment = value;
    const keys = Object.keys(equipment);
    return (keys.length > 0 &&
        keys.every((key) => UPDATE_FIELDS.has(key)) &&
        (equipment.placaSena === undefined || isPlate(equipment.placaSena)) &&
        (equipment.codigoActivo === undefined || isCode(equipment.codigoActivo)) &&
        (equipment.tipo === undefined || isType(equipment.tipo)));
};
const isUpdateStatusDTO = (value) => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return false;
    }
    const body = value;
    const keys = Object.keys(body);
    return keys.length === 1 && keys[0] === 'estado' && isStatus(body.estado);
};
const isMoveDTO = (value) => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return false;
    }
    const body = value;
    const keys = Object.keys(body);
    return keys.length === 1 && keys[0] === 'roomId' && isUuid(body.roomId);
};
const reject = (res, error) => {
    res.status(400).json({
        success: false,
        error
    });
};
const validateEquipmentPayload = (req, res, next) => {
    const body = req.body;
    if (!isCreateEquipmentDTO(body)) {
        reject(res, 'Datos del equipo inválidos.');
        return;
    }
    next();
};
exports.validateEquipmentPayload = validateEquipmentPayload;
const validateEquipmentUpdatePayload = (req, res, next) => {
    const body = req.body;
    if (!isUpdateEquipmentDTO(body)) {
        reject(res, 'Datos de actualización del equipo inválidos.');
        return;
    }
    next();
};
exports.validateEquipmentUpdatePayload = validateEquipmentUpdatePayload;
const validateEquipmentStatusPayload = (req, res, next) => {
    const body = req.body;
    if (!isUpdateStatusDTO(body)) {
        reject(res, 'El estado del equipo no es válido.');
        return;
    }
    next();
};
exports.validateEquipmentStatusPayload = validateEquipmentStatusPayload;
const validateEquipmentMovePayload = (req, res, next) => {
    const body = req.body;
    if (!isMoveDTO(body)) {
        reject(res, 'El ambiente de destino debe ser un UUID válido.');
        return;
    }
    next();
};
exports.validateEquipmentMovePayload = validateEquipmentMovePayload;
const validateEquipmentFilters = (req, res, next) => {
    const { roomId, estado, tipo, placaSena, codigoActivo } = req.query;
    if (!Object.keys(req.query).every((key) => FILTER_FIELDS.has(key)) ||
        (roomId !== undefined && !isUuid(roomId)) ||
        (estado !== undefined && !isStatus(estado)) ||
        (tipo !== undefined && !isType(tipo)) ||
        (placaSena !== undefined && typeof placaSena !== 'string') ||
        (codigoActivo !== undefined && typeof codigoActivo !== 'string')) {
        reject(res, 'Filtros del equipo inválidos.');
        return;
    }
    next();
};
exports.validateEquipmentFilters = validateEquipmentFilters;
const validateEquipmentIdParam = (req, res, next) => {
    const { id } = req.params;
    if (!isUuid(id)) {
        reject(res, 'El identificador del equipo debe ser un UUID válido.');
        return;
    }
    next();
};
exports.validateEquipmentIdParam = validateEquipmentIdParam;
