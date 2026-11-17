"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryEquipmentRepository = void 0;
const crypto_1 = require("crypto");
class InMemoryEquipmentRepository {
    equipments = new Map();
    async create(input) {
        const equipment = {
            ...input,
            id: (0, crypto_1.randomUUID)(),
            estado: 'OPERATIVO'
        };
        this.equipments.set(equipment.id, equipment);
        return { ...equipment };
    }
    async findAll(filters = {}) {
        const normalizedRoomId = filters.roomId?.toLowerCase();
        const normalizedPlate = filters.placaSena?.toLowerCase();
        const normalizedCode = filters.codigoActivo?.toLowerCase();
        return Array.from(this.equipments.values())
            .filter((equipment) => (!normalizedRoomId ||
            equipment.roomId.toLowerCase() === normalizedRoomId) &&
            (filters.estado === undefined ||
                equipment.estado === filters.estado) &&
            (filters.tipo === undefined || equipment.tipo === filters.tipo) &&
            (!normalizedPlate ||
                equipment.placaSena.toLowerCase().includes(normalizedPlate)) &&
            (!normalizedCode ||
                equipment.codigoActivo.toLowerCase().includes(normalizedCode)))
            .map((equipment) => ({ ...equipment }));
    }
    async findById(id) {
        const equipment = this.equipments.get(id);
        return equipment ? { ...equipment } : null;
    }
    async findByPlacaSena(placaSena) {
        const normalizedPlate = placaSena.toLowerCase();
        const equipment = Array.from(this.equipments.values()).find((candidate) => candidate.placaSena.toLowerCase() === normalizedPlate);
        return equipment ? { ...equipment } : null;
    }
    async findByCodigoActivo(codigoActivo) {
        const normalizedCode = codigoActivo.toLowerCase();
        const equipment = Array.from(this.equipments.values()).find((candidate) => candidate.codigoActivo.toLowerCase() === normalizedCode);
        return equipment ? { ...equipment } : null;
    }
    async update(id, changes) {
        const equipment = this.equipments.get(id);
        if (!equipment) {
            return null;
        }
        const updated = {
            ...equipment,
            ...changes
        };
        this.equipments.set(id, updated);
        return { ...updated };
    }
    async updateStatus(id, estado) {
        const equipment = this.equipments.get(id);
        if (!equipment) {
            return null;
        }
        const updated = {
            ...equipment,
            estado
        };
        this.equipments.set(id, updated);
        return { ...updated };
    }
    async move(id, roomId) {
        const equipment = this.equipments.get(id);
        if (!equipment) {
            return null;
        }
        const updated = {
            ...equipment,
            roomId
        };
        this.equipments.set(id, updated);
        return { ...updated };
    }
    async countByRoomAndType(roomId, tipo) {
        const normalizedRoomId = roomId.toLowerCase();
        return Array.from(this.equipments.values()).filter((equipment) => equipment.roomId.toLowerCase() === normalizedRoomId &&
            equipment.tipo === tipo).length;
    }
}
exports.InMemoryEquipmentRepository = InMemoryEquipmentRepository;
