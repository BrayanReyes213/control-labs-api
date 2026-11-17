"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentController = void 0;
const container_1 = require("../container");
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
class EquipmentController {
    static createEquipment = async (req, res) => {
        const equipment = await container_1.equipmentService.createEquipment(req.body);
        res.status(201).json({ success: true, data: equipment });
    };
    static getEquipments = async (req, res) => {
        const { roomId, estado, tipo, placaSena, codigoActivo } = req.query;
        if (roomId !== undefined && typeof roomId !== 'string') {
            throw new domain_error_1.DomainError('VALIDATION_ERROR', 'El filtro roomId debe ser un texto.');
        }
        if (estado !== undefined &&
            (typeof estado !== 'string' ||
                !EQUIPMENT_STATUSES.includes(estado))) {
            throw new domain_error_1.DomainError('VALIDATION_ERROR', 'El filtro estado debe ser OPERATIVO, MANTENIMIENTO o FUERA_DE_SERVICIO.');
        }
        if (tipo !== undefined &&
            (typeof tipo !== 'string' ||
                !EQUIPMENT_TYPES.includes(tipo))) {
            throw new domain_error_1.DomainError('VALIDATION_ERROR', 'El filtro tipo no es válido.');
        }
        if (placaSena !== undefined && typeof placaSena !== 'string') {
            throw new domain_error_1.DomainError('VALIDATION_ERROR', 'El filtro placaSena debe ser un texto.');
        }
        if (codigoActivo !== undefined && typeof codigoActivo !== 'string') {
            throw new domain_error_1.DomainError('VALIDATION_ERROR', 'El filtro codigoActivo debe ser un texto.');
        }
        const filters = {
            roomId,
            estado: estado,
            tipo: tipo,
            placaSena,
            codigoActivo
        };
        const equipments = await container_1.equipmentService.getEquipments(filters);
        res.status(200).json({ success: true, data: equipments });
    };
    static getEquipmentById = async (req, res) => {
        const equipment = await container_1.equipmentService.getEquipmentDetail(req.params.id);
        res.status(200).json({ success: true, data: equipment });
    };
    static updateEquipment = async (req, res) => {
        const equipment = await container_1.equipmentService.updateEquipment(req.params.id, req.body);
        res.status(200).json({ success: true, data: equipment });
    };
    static updateEquipmentStatus = async (req, res) => {
        const equipment = await container_1.equipmentService.updateEquipmentStatus(req.params.id, req.body.estado);
        res.status(200).json({ success: true, data: equipment });
    };
    static moveEquipment = async (req, res) => {
        const equipment = await container_1.equipmentService.moveEquipment(req.params.id, req.body.roomId);
        res.status(200).json({ success: true, data: equipment });
    };
}
exports.EquipmentController = EquipmentController;
