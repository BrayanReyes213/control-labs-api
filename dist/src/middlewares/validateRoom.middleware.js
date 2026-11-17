"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRoomPayload = void 0;
const isCreateRoomDTO = (value) => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return false;
    }
    const room = value;
    return (typeof room.numero === 'string' && room.numero.trim() !== '' &&
        typeof room.capacidad === 'number' && Number.isInteger(room.capacidad) &&
        typeof room.equipos === 'number' && Number.isInteger(room.equipos) &&
        typeof room.televisores === 'number' && Number.isInteger(room.televisores));
};
const validateRoomPayload = (req, res, next) => {
    const body = req.body;
    if (!isCreateRoomDTO(body)) {
        res.status(400).json({
            success: false,
            error: 'Datos del ambiente inválidos.'
        });
        return;
    }
    next();
};
exports.validateRoomPayload = validateRoomPayload;
