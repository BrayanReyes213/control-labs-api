"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnvironmentPayload = void 0;
const isCreateEnvironmentDTO = (value) => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return false;
    }
    const environment = value;
    return (typeof environment.numero === 'string' && environment.numero.trim() !== '' &&
        typeof environment.capacidad === 'number' && Number.isInteger(environment.capacidad) &&
        typeof environment.equipos === 'string' && environment.equipos.trim() !== '' &&
        typeof environment.televisores === 'string' && environment.televisores.trim() !== '');
};
const validateEnvironmentPayload = (req, res, next) => {
    const body = req.body;
    if (!isCreateEnvironmentDTO(body)) {
        res.status(400).json({
            success: false,
            error: 'Datos del ambiente inválidos.'
        });
        return;
    }
    next();
};
exports.validateEnvironmentPayload = validateEnvironmentPayload;
