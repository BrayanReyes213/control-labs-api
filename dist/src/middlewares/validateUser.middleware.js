"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserActivePayload = exports.validateUserUpdatePayload = exports.validateUserPayload = void 0;
const USER_ROLES = ['ADMIN', 'GUARDA', 'INSTRUCTOR'];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USER_FIELDS = new Set(['nombre', 'email', 'rol']);
const MAX_NAME_LENGTH = 150;
const MAX_EMAIL_LENGTH = 255;
const isName = (value) => typeof value === 'string' &&
    value.trim() !== '' &&
    value.trim().length <= MAX_NAME_LENGTH;
const isEmail = (value) => typeof value === 'string' &&
    value.trim().length <= MAX_EMAIL_LENGTH &&
    EMAIL_PATTERN.test(value.trim());
const isUserRole = (value) => typeof value === 'string' && USER_ROLES.includes(value);
const isCreateUserDTO = (value) => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return false;
    }
    const user = value;
    return (Object.keys(user).every((key) => USER_FIELDS.has(key)) &&
        isName(user.nombre) &&
        isEmail(user.email) &&
        isUserRole(user.rol));
};
const isUpdateUserDTO = (value) => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return false;
    }
    const user = value;
    const keys = Object.keys(user);
    return (keys.length > 0 &&
        keys.every((key) => USER_FIELDS.has(key)) &&
        (user.nombre === undefined || isName(user.nombre)) &&
        (user.email === undefined || isEmail(user.email)) &&
        (user.rol === undefined || isUserRole(user.rol)));
};
const isUpdateUserActiveDTO = (value) => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return false;
    }
    const body = value;
    const keys = Object.keys(body);
    return (keys.length === 1 &&
        keys[0] === 'activo' &&
        typeof body.activo === 'boolean');
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
const validateUserUpdatePayload = (req, res, next) => {
    const body = req.body;
    if (!isUpdateUserDTO(body)) {
        res.status(400).json({
            success: false,
            error: 'Datos de actualización del usuario inválidos.'
        });
        return;
    }
    next();
};
exports.validateUserUpdatePayload = validateUserUpdatePayload;
const validateUserActivePayload = (req, res, next) => {
    const body = req.body;
    if (!isUpdateUserActiveDTO(body)) {
        res.status(400).json({
            success: false,
            error: 'El campo activo debe ser un booleano.'
        });
        return;
    }
    next();
};
exports.validateUserActivePayload = validateUserActivePayload;
