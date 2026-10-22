"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEquipmentPayload = void 0;
const isCreateEquipmentDTO = (value) => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return false;
    }
    const equipment = value;
    return (typeof equipment.codigo === 'string' && equipment.codigo.trim() !== '' &&
        typeof equipment.teclado === 'boolean' &&
        typeof equipment.mouse === 'boolean' &&
        typeof equipment.pantalla === 'boolean' &&
        typeof equipment.cables === 'boolean');
};
const validateEquipmentPayload = (req, res, next) => {
    const body = req.body;
    if (!isCreateEquipmentDTO(body)) {
        res.status(400).json({
            success: false,
            error: 'Datos del equipo inválidos.'
        });
        return;
    }
    next();
};
exports.validateEquipmentPayload = validateEquipmentPayload;
