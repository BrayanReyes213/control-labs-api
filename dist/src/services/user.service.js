"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const domain_error_1 = require("../errors/domain.error");
const USER_ROLES = ['ADMIN', 'GUARDA', 'INSTRUCTOR'];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_NAME_LENGTH = 150;
const MAX_EMAIL_LENGTH = 255;
class UserService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async createUser(input) {
        this.validateName(input.nombre);
        const email = this.normalizeEmail(input.email);
        this.validateEmail(email);
        this.validateRole(input.rol);
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new domain_error_1.DomainError('CONFLICT', `Ya existe un usuario con el email ${email}.`);
        }
        return this.userRepository.create({
            nombre: input.nombre.trim(),
            email,
            rol: input.rol
        });
    }
    async getUsers(filters = {}) {
        if (filters.rol !== undefined) {
            this.validateRole(filters.rol);
        }
        return this.userRepository.findAll({
            rol: filters.rol,
            activo: filters.activo,
            email: filters.email !== undefined
                ? this.normalizeEmail(filters.email)
                : undefined
        });
    }
    async getUserDetail(id) {
        this.validateId(id);
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new domain_error_1.DomainError('NOT_FOUND', `No existe un usuario con identificador ${id}.`);
        }
        return user;
    }
    async updateUser(id, input) {
        this.validateId(id);
        const currentUser = await this.userRepository.findById(id);
        if (!currentUser) {
            throw new domain_error_1.DomainError('NOT_FOUND', `No existe un usuario con identificador ${id}.`);
        }
        const changes = {};
        if (input.nombre !== undefined) {
            this.validateName(input.nombre);
            changes.nombre = input.nombre.trim();
        }
        if (input.email !== undefined) {
            const email = this.normalizeEmail(input.email);
            this.validateEmail(email);
            const existingUser = await this.userRepository.findByEmail(email);
            if (existingUser && existingUser.id !== id) {
                throw new domain_error_1.DomainError('CONFLICT', `Ya existe un usuario con el email ${email}.`);
            }
            changes.email = email;
        }
        if (input.rol !== undefined) {
            this.validateRole(input.rol);
            changes.rol = input.rol;
        }
        if (Object.keys(changes).length === 0) {
            throw new domain_error_1.DomainError('VALIDATION_ERROR', 'Debe enviar al menos un campo para actualizar.');
        }
        const updatedUser = await this.userRepository.update(id, changes);
        if (!updatedUser) {
            throw new domain_error_1.DomainError('NOT_FOUND', `No existe un usuario con identificador ${id}.`);
        }
        return updatedUser;
    }
    async setUserActive(id, activo) {
        this.validateId(id);
        const updatedUser = await this.userRepository.setActive(id, activo);
        if (!updatedUser) {
            throw new domain_error_1.DomainError('NOT_FOUND', `No existe un usuario con identificador ${id}.`);
        }
        return updatedUser;
    }
    validateName(nombre) {
        if (typeof nombre !== 'string' || nombre.trim() === '') {
            throw new domain_error_1.DomainError('VALIDATION_ERROR', 'El nombre del usuario es obligatorio.');
        }
        if (nombre.trim().length > MAX_NAME_LENGTH) {
            throw new domain_error_1.DomainError('VALIDATION_ERROR', `El nombre del usuario no puede superar los ${MAX_NAME_LENGTH} caracteres.`);
        }
    }
    validateEmail(email) {
        if (!EMAIL_PATTERN.test(email)) {
            throw new domain_error_1.DomainError('VALIDATION_ERROR', 'El email del usuario no es válido.');
        }
        if (email.length > MAX_EMAIL_LENGTH) {
            throw new domain_error_1.DomainError('VALIDATION_ERROR', `El email del usuario no puede superar los ${MAX_EMAIL_LENGTH} caracteres.`);
        }
    }
    validateRole(rol) {
        if (!USER_ROLES.includes(rol)) {
            throw new domain_error_1.DomainError('VALIDATION_ERROR', 'El rol debe ser ADMIN, GUARDA o INSTRUCTOR.');
        }
    }
    validateId(id) {
        if (!UUID_PATTERN.test(id)) {
            throw new domain_error_1.DomainError('VALIDATION_ERROR', 'El identificador del usuario debe ser un UUID válido.');
        }
    }
    normalizeEmail(email) {
        return email.trim().toLowerCase();
    }
}
exports.UserService = UserService;
