"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLoanPayload = void 0;
const isCreateLoanDTO = (value) => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return false;
    }
    const loan = value;
    return (typeof loan.aula === 'string' && loan.aula.trim() !== '' &&
        typeof loan.numeroPC === 'number' && Number.isInteger(loan.numeroPC) &&
        typeof loan.nombreGuardaEntrega === 'string' && loan.nombreGuardaEntrega.trim() !== '' &&
        typeof loan.instructorRecibe === 'string' && loan.instructorRecibe.trim() !== '');
};
const validateLoanPayload = (req, res, next) => {
    const body = req.body;
    if (!isCreateLoanDTO(body)) {
        res.status(400).json({
            success: false,
            error: 'Datos del préstamo inválidos.'
        });
        return;
    }
    next();
};
exports.validateLoanPayload = validateLoanPayload;
