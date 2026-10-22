"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserPayload = void 0;
const isCreateUserDTO = (value) => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return false;
    }
    const user = value;
    return (typeof user.nombre === 'string' && user.nombre.trim() !== '' &&
        typeof user.identificacion === 'number' && Number.isInteger(user.identificacion) &&
        typeof user.telefono === 'string' && user.telefono.trim() !== '' &&
        typeof user.cargo === 'string' && user.cargo.trim() !== '');
};
const validateUserPayload = (req, res, next) => {
    const body = req.body;
    if (!isCreateUserDTO(body)) {
        res.status(400).json({
            success: false,
            error: 'Datos del usuario inválidos.'
        });
        return;
    }
    next();
};
exports.validateUserPayload = validateUserPayload;
