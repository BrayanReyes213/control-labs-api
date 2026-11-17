"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomController = void 0;
const container_1 = require("../container");
const domain_error_1 = require("../errors/domain.error");
const ROOM_STATUSES = [
    'OPERATIVO',
    'MANTENIMIENTO',
    'INACTIVO'
];
class RoomController {
    static createRoom = async (req, res) => {
        const room = await container_1.roomService.createRoom(req.body);
        res.status(201).json({ success: true, data: room });
    };
    static getRooms = async (req, res) => {
        const { nombre, bloque, estado } = req.query;
        if (nombre !== undefined && typeof nombre !== 'string') {
            throw new domain_error_1.DomainError('VALIDATION_ERROR', 'El filtro nombre debe ser un texto.');
        }
        if (bloque !== undefined && typeof bloque !== 'string') {
            throw new domain_error_1.DomainError('VALIDATION_ERROR', 'El filtro bloque debe ser un texto.');
        }
        if (estado !== undefined &&
            (typeof estado !== 'string' ||
                !ROOM_STATUSES.includes(estado))) {
            throw new domain_error_1.DomainError('VALIDATION_ERROR', 'El filtro estado debe ser OPERATIVO, MANTENIMIENTO o INACTIVO.');
        }
        const filters = {
            nombre,
            bloque,
            estado: estado
        };
        const rooms = await container_1.roomService.getRooms(filters);
        res.status(200).json({ success: true, data: rooms });
    };
    static getRoomById = async (req, res) => {
        const room = await container_1.roomService.getRoomDetail(req.params.id);
        res.status(200).json({ success: true, data: room });
    };
    static updateRoom = async (req, res) => {
        const room = await container_1.roomService.updateRoom(req.params.id, req.body);
        res.status(200).json({ success: true, data: room });
    };
    static updateRoomStatus = async (req, res) => {
        const room = await container_1.roomService.updateRoomStatus(req.params.id, req.body.estado);
        res.status(200).json({ success: true, data: room });
    };
}
exports.RoomController = RoomController;
