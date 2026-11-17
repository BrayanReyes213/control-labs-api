"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentService = void 0;
const domain_error_1 = require("../errors/domain.error");
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
const CAPACITY_TYPE = 'COMPUTADOR';
const MAX_PLATE_LENGTH = 50;
const MAX_CODE_LENGTH = 100;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
class EquipmentService {
    equipmentRepository;
    roomRepository;
    constructor(equipmentRepository, roomRepository) {
        this.equipmentRepository = equipmentRepository;
        this.roomRepository = roomRepository;
    }
    async createEquipment(input) {
        this.validatePlate(input.placaSena);
        this.validateCode(input.codigoActivo);
        this.validateType(input.tipo);
        this.validateId(input.roomId);
        const placaSena = input.placaSena.trim();
        const codigoActivo = input.codigoActivo.trim();
        const existingPlate = await this.equipmentRepository.findByPlacaSena(placaSena);
        if (existingPlate) {
            throw new domain_error_1.DomainError('CONFLICT', `Ya existe un equipo con la placa SENA ${placaSena}.`);
        }
        const existingCode = await this.equipmentRepository.findByCodigoActivo(codigoActivo);
        if (existingCode) {
            throw new domain_error_1.DomainError('CONFLICT', `Ya existe un equipo con el código de activo ${codigoActivo}.`);
        }
        await this.ensureAvailableRoom(input.roomId, input.tipo);
        return this.equipmentRepository.create({
            placaSena,
            codigoActivo,
            tipo: input.tipo,
            roomId: input.roomId
        });
    }
    async getEquipments(filters = {}) {
        if (filters.estado !== undefined) {
            this.validateStatus(filters.estado);
        }
        if (filters.tipo !== undefined) {
            this.validateType(filters.tipo);
        }
        if (filters.roomId !== undefined) {
            this.validateId(filters.roomId);
        }
        return this.equipmentRepository.findAll({
            roomId: filters.roomId,
            estado: filters.estado,
            tipo: filters.tipo,
            placaSena: filters.placaSena?.trim(),
            codigoActivo: filters.codigoActivo?.trim()
        });
    }
    async getEquipmentDetail(id) {
        this.validateId(id);
        const equipment = await this.equipmentRepository.findById(id);
        if (!equipment) {
            throw new domain_error_1.DomainError('NOT_FOUND', `No existe un equipo con identificador ${id}.`);
        }
        return equipment;
    }
    async updateEquipment(id, input) {
        this.validateId(id);
        const currentEquipment = await this.equipmentRepository.findById(id);
        if (!currentEquipment) {
            throw new domain_error_1.DomainError('NOT_FOUND', `No existe un equipo con identificador ${id}.`);
        }
        const changes = {};
        if (input.placaSena !== undefined) {
            this.validatePlate(input.placaSena);
            const placaSena = input.placaSena.trim();
            const existingPlate = await this.equipmentRepository.findByPlacaSena(placaSena);
            if (existingPlate && existingPlate.id !== id) {
                throw new domain_error_1.DomainError('CONFLICT', `Ya existe un equipo con la placa SENA ${placaSena}.`);
            }
            changes.placaSena = placaSena;
        }
        if (input.codigoActivo !== undefined) {
            this.validateCode(input.codigoActivo);
            const codigoActivo = input.codigoActivo.trim();
            const existingCode = await this.equipmentRepository.findByCodigoActivo(codigoActivo);
            if (existingCode && existingCode.id !== id) {
                throw new domain_error_1.DomainError('CONFLICT', `Ya existe un equipo con el código de activo ${codigoActivo}.`);
            }
            changes.codigoActivo = codigoActivo;
        }
        if (input.tipo !== undefined) {
            this.validateType(input.tipo);
            changes.tipo = input.tipo;
        }
        if (Object.keys(changes).length === 0) {
            throw new domain_error_1.DomainError('VALIDATION_ERROR', 'Debe enviar al menos un campo para actualizar.');
        }
        const updatedEquipment = await this.equipmentRepository.update(id, changes);
        if (!updatedEquipment) {
            throw new domain_error_1.DomainError('NOT_FOUND', `No existe un equipo con identificador ${id}.`);
        }
        return updatedEquipment;
    }
    async updateEquipmentStatus(id, estado) {
        this.validateId(id);
        this.validateStatus(estado);
        const updatedEquipment = await this.equipmentRepository.updateStatus(id, estado);
        if (!updatedEquipment) {
            throw new domain_error_1.DomainError('NOT_FOUND', `No existe un equipo con identificador ${id}.`);
        }
        return updatedEquipment;
    }
    async moveEquipment(id, roomId) {
        this.validateId(id);
        this.validateId(roomId);
        const equipment = await this.equipmentRepository.findById(id);
        if (!equipment) {
            throw new domain_error_1.DomainError('NOT_FOUND', `No existe un equipo con identificador ${id}.`);
        }
        if (equipment.estado === 'FUERA_DE_SERVICIO') {
            throw new domain_error_1.DomainError('CONFLICT', 'Un equipo fuera de servicio no puede trasladarse.');
        }
        if (equipment.roomId.toLowerCase() === roomId.toLowerCase()) {
            return equipment;
        }
        await this.ensureAvailableRoom(roomId, equipment.tipo);
        const movedEquipment = await this.equipmentRepository.move(id, roomId);
        if (!movedEquipment) {
            throw new domain_error_1.DomainError('NOT_FOUND', `No existe un equipo con identificador ${id}.`);
        }
        return movedEquipment;
    }
    async ensureAvailableRoom(roomId, tipo) {
        const room = await this.roomRepository.findById(roomId);
        if (!room) {
            throw new domain_error_1.DomainError('NOT_FOUND', `No existe un ambiente con identificador ${roomId}.`);
        }
        if (room.estado !== 'OPERATIVO') {
            throw new domain_error_1.DomainError('CONFLICT', 'El ambiente de destino no está operativo.');
        }
        if (tipo === CAPACITY_TYPE) {
            const installed = await this.equipmentRepository.countByRoomAndType(roomId, CAPACITY_TYPE);
            if (installed >= room.capacidadPcs) {
                throw new domain_error_1.DomainError('CONFLICT', 'El ambiente de destino no tiene capacidad disponible para más computadores.');
            }
        }
    }
    validatePlate(placaSena) {
        if (typeof placaSena !== 'string' || placaSena.trim() === '') {
            throw new domain_error_1.DomainError('VALIDATION_ERROR', 'La placa SENA del equipo es obligatoria.');
        }
        if (placaSena.trim().length > MAX_PLATE_LENGTH) {
            throw new domain_error_1.DomainError('VALIDATION_ERROR', `La placa SENA no puede superar los ${MAX_PLATE_LENGTH} caracteres.`);
        }
    }
    validateCode(codigoActivo) {
        if (typeof codigoActivo !== 'string' || codigoActivo.trim() === '') {
            throw new domain_error_1.DomainError('VALIDATION_ERROR', 'El código de activo del equipo es obligatorio.');
        }
        if (codigoActivo.trim().length > MAX_CODE_LENGTH) {
            throw new domain_error_1.DomainError('VALIDATION_ERROR', `El código de activo no puede superar los ${MAX_CODE_LENGTH} caracteres.`);
        }
    }
    validateType(tipo) {
        if (!EQUIPMENT_TYPES.includes(tipo)) {
            throw new domain_error_1.DomainError('VALIDATION_ERROR', 'El tipo de equipo no es válido.');
        }
    }
    validateStatus(estado) {
        if (!EQUIPMENT_STATUSES.includes(estado)) {
            throw new domain_error_1.DomainError('VALIDATION_ERROR', 'El estado debe ser OPERATIVO, MANTENIMIENTO o FUERA_DE_SERVICIO.');
        }
    }
    validateId(id) {
        if (!UUID_PATTERN.test(id)) {
            throw new domain_error_1.DomainError('VALIDATION_ERROR', 'El identificador debe ser un UUID válido.');
        }
    }
}
exports.EquipmentService = EquipmentService;
