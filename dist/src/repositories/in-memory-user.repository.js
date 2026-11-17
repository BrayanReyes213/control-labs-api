"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryUserRepository = void 0;
const crypto_1 = require("crypto");
class InMemoryUserRepository {
    users = new Map();
    async create(input) {
        const user = {
            ...input,
            email: input.email.toLowerCase(),
            id: (0, crypto_1.randomUUID)(),
            activo: true,
            createdAt: new Date().toISOString()
        };
        this.users.set(user.id, user);
        return { ...user };
    }
    async findAll(filters = {}) {
        const normalizedEmail = filters.email?.toLowerCase();
        return Array.from(this.users.values())
            .filter((user) => (filters.rol === undefined || user.rol === filters.rol) &&
            (filters.activo === undefined || user.activo === filters.activo) &&
            (!normalizedEmail || user.email.toLowerCase() === normalizedEmail))
            .map((user) => ({ ...user }));
    }
    async findById(id) {
        const user = this.users.get(id);
        return user ? { ...user } : null;
    }
    async findByEmail(email) {
        const normalizedEmail = email.toLowerCase();
        const user = Array.from(this.users.values()).find((candidate) => candidate.email.toLowerCase() === normalizedEmail);
        return user ? { ...user } : null;
    }
    async update(id, changes) {
        const user = this.users.get(id);
        if (!user) {
            return null;
        }
        const updated = {
            ...user,
            ...changes,
            email: changes.email?.toLowerCase() ?? user.email
        };
        this.users.set(id, updated);
        return { ...updated };
    }
    async setActive(id, activo) {
        const user = this.users.get(id);
        if (!user) {
            return null;
        }
        const updated = {
            ...user,
            activo
        };
        this.users.set(id, updated);
        return { ...updated };
    }
}
exports.InMemoryUserRepository = InMemoryUserRepository;
