"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryRoomRepository = void 0;
const crypto_1 = require("crypto");
class InMemoryRoomRepository {
    rooms = new Map();
    async create(input) {
        const room = {
            ...input,
            id: (0, crypto_1.randomUUID)(),
            estado: 'OPERATIVO'
        };
        this.rooms.set(room.id, room);
        return { ...room };
    }
    async findAll(filters = {}) {
        const normalizedName = filters.nombre?.toLowerCase();
        const normalizedBlock = filters.bloque?.toLowerCase();
        return Array.from(this.rooms.values())
            .filter((room) => (!normalizedName ||
            room.nombre.toLowerCase().includes(normalizedName)) &&
            (!normalizedBlock ||
                room.bloque.toLowerCase().includes(normalizedBlock)) &&
            (filters.estado === undefined || room.estado === filters.estado))
            .map((room) => ({ ...room }));
    }
    async findById(id) {
        const room = this.rooms.get(id);
        return room ? { ...room } : null;
    }
    async findByName(nombre) {
        const normalizedName = nombre.toLowerCase();
        const room = Array.from(this.rooms.values()).find((candidate) => candidate.nombre.toLowerCase() === normalizedName);
        return room ? { ...room } : null;
    }
    async update(id, changes) {
        const room = this.rooms.get(id);
        if (!room) {
            return null;
        }
        const updated = {
            ...room,
            ...changes
        };
        this.rooms.set(id, updated);
        return { ...updated };
    }
    async updateStatus(id, estado) {
        const room = this.rooms.get(id);
        if (!room) {
            return null;
        }
        const updated = {
            ...room,
            estado
        };
        this.rooms.set(id, updated);
        return { ...updated };
    }
}
exports.InMemoryRoomRepository = InMemoryRoomRepository;
