"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const container_1 = require("../container");
const domain_error_1 = require("../errors/domain.error");
const USER_ROLES = ['ADMIN', 'GUARDA', 'INSTRUCTOR'];
class UserController {
    static createUser = async (req, res) => {
        const user = await container_1.userService.createUser(req.body);
        res.status(201).json({ success: true, data: user });
    };
    static getUsers = async (req, res) => {
        const { rol, activo, email } = req.query;
        if (rol !== undefined &&
            (typeof rol !== 'string' || !USER_ROLES.includes(rol))) {
            throw new domain_error_1.DomainError('VALIDATION_ERROR', 'El filtro rol debe ser ADMIN, GUARDA o INSTRUCTOR.');
        }
        if (activo !== undefined &&
            (typeof activo !== 'string' ||
                (activo !== 'true' && activo !== 'false'))) {
            throw new domain_error_1.DomainError('VALIDATION_ERROR', 'El filtro activo debe ser true o false.');
        }
        if (email !== undefined && typeof email !== 'string') {
            throw new domain_error_1.DomainError('VALIDATION_ERROR', 'El filtro email debe ser un texto.');
        }
        const filters = {
            rol: rol,
            activo: activo === undefined ? undefined : activo === 'true',
            email
        };
        const users = await container_1.userService.getUsers(filters);
        res.status(200).json({ success: true, data: users });
    };
    static getUserById = async (req, res) => {
        const user = await container_1.userService.getUserDetail(req.params.id);
        res.status(200).json({ success: true, data: user });
    };
    static updateUser = async (req, res) => {
        const user = await container_1.userService.updateUser(req.params.id, req.body);
        res.status(200).json({ success: true, data: user });
    };
    static setUserActive = async (req, res) => {
        const user = await container_1.userService.setUserActive(req.params.id, req.body.activo);
        res.status(200).json({ success: true, data: user });
    };
}
exports.UserController = UserController;
