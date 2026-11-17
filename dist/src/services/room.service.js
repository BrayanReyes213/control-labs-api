"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomService = void 0;
const domain_error_1 = require("../errors/domain.error");
const ROOM_STATUSES = [
    'OPERATIVO',
    'MANTENIMIENTO',
    'INACTIVO'
];
const MAX_NAME_LENGTH = 100;
const MAX_BLOCK_LENGTH = 50;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
class RoomService {
    roomRepository;
    equipmentRepository;
    constructor(roomRepository, equipmentRepository) {
        this.roomRepository = roomRepository;
        this.equipmentRepository = equipmentRepository;
    }
    async createRoom(input) {
        this.validateName(input.nombre);
        this.validateBlock(input.bloque);
        this.validateCapacity(input.capacidadPcs);
        const nombre = input.nombre.trim();
        const existingRoom = await this.roomRepository.findByName(nombre);
        if (existingRoom) {
            throw new domain_error_1.DomainError('CONFLICT', `Ya existe un ambiente con el nombre ${nombre}.`);
        }
        return this.roomRepository.create({
            nombre,
            bloque: input.bloque.trim(),
            capacidadPcs: input.capacidadPcs
        });
    }
    async getRooms(filters = {}) {
        if (filters.estado !== undefined) {
            this.validateStatus(filters.estado);
        }
        return this.roomRepository.findAll({
            nombre: filters.nombre?.trim(),
            bloque: filters.bloque?.trim(),
            estado: filters.estado
        });
    }
    async getRoomDetail(id) {
        this.validateId(id);
        const room = await this.roomRepository.findById(id);
        if (!room) {
            throw new domain_error_1.DomainError('NOT_FOUND', `No existe un ambiente con identificador ${id}.`);
        }
        return room;
    }
    async updateRoom(id, input) {
        this.validateId(id);
        const currentRoom = await this.roomRepository.findById(id);
        if (!currentRoom) {
            throw new domain_error_1.DomainError('NOT_FOUND', `No existe un ambiente con identificador ${id}.`);
        }
        const changes = {};
        if (input.nombre !== undefined) {
            this.validateName(input.nombre);
            const nombre = input.nombre.trim();
            const existingRoom = await this.roomRepository.findByName(nombre);
            if (existingRoom && existingRoom.id !== id) {
                throw new domain_error_1.DomainError('CONFLICT', `Ya existe un ambiente con el nombre ${nombre}.`);
            }
            changes.nombre = nombre;
        }
        if (input.bloque !== undefined) {
            this.validateBlock(input.bloque);
            changes.bloque = input.bloque.trim();
        }
        if (input.capacidadPcs !== undefined) {
            this.validateCapacity(input.capacidadPcs);
            const installedComputers = await this.equipmentRepository.countByRoomAndType(id, 'COMPUTADOR');
            if (input.capacidadPcs < installedComputers) {
                throw new domain_error_1.DomainError('CONFLICT', `No se puede reducir la capacidad por debajo de los ${installedComputers} computadores instalados.`);
            }
            changes.capacidadPcs = input.capacidadPcs;
        }
        if (Object.keys(changes).length === 0) {
            throw new domain_error_1.DomainError('VALIDATION_ERROR', 'Debe enviar al menos un campo para actualizar.');
        }
        const updatedRoom = await this.roomRepository.update(id, changes);
        if (!updatedRoom) {
            throw new domain_error_1.DomainError('NOT_FOUND', `No existe un ambiente con identificador ${id}.`);
        }
        return updatedRoom;
    }
    async updateRoomStatus(id, estado) {
        this.validateId(id);
        this.validateStatus(estado);
        const updatedRoom = await this.roomRepository.updateStatus(id, estado);
        if (!updatedRoom) {
            throw new domain_error_1.DomainError('NOT_FOUND', `No existe un ambiente con identificador ${id}.`);
        }
        return updatedRoom;
    }
    validateName(nombre) {
        if (typeof nombre !== 'string' || nombre.trim() === '') {
            throw new domain_error_1.DomainError('VALIDATION_ERROR', 'El nombre del ambiente es obligatorio.');
        }
        if (nombre.trim().length > MAX_NAME_LENGTH) {
            throw new domain_error_1.DomainError('VALIDATION_ERROR', `El nombre del ambiente no puede superar los ${MAX_NAME_LENGTH} caracteres.`);
        }
    }
    validateBlock(bloque) {
        if (typeof bloque !== 'string' || bloque.trim() === '') {
            throw new domain_error_1.DomainError('VALIDATION_ERROR', 'El bloque del ambiente es obligatorio.');
        }
        if (bloque.trim().length > MAX_BLOCK_LENGTH) {
            throw new domain_error_1.DomainError('VALIDATION_ERROR', `El bloque del ambiente no puede superar los ${MAX_BLOCK_LENGTH} caracteres.`);
        }
    }
    validateCapacity(capacidadPcs) {
        if (!Number.isInteger(capacidadPcs) || capacidadPcs < 0) {
            throw new domain_error_1.DomainError('VALIDATION_ERROR', 'La capacidad de PCs debe ser un entero mayor o igual a 0.');
        }
    }
    validateStatus(estado) {
        if (!ROOM_STATUSES.includes(estado)) {
            throw new domain_error_1.DomainError('VALIDATION_ERROR', 'El estado debe ser OPERATIVO, MANTENIMIENTO o INACTIVO.');
        }
    }
    validateId(id) {
        if (!UUID_PATTERN.test(id)) {
            throw new domain_error_1.DomainError('VALIDATION_ERROR', 'El identificador del ambiente debe ser un UUID válido.');
        }
    }
}
exports.RoomService = RoomService;
