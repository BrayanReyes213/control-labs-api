"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentController = void 0;
class EquipmentController {
    static getEquipmentsByFilter = (req, res) => {
        // TODO: tomar los filtros de req.query (ej. ambiente), llamar al servicio y responder con los resultados.
        res.status(501).json({
            success: false,
            message: 'La consulta de equipos todavía no está implementada.'
        });
    };
    static createEquipment = (req, res) => {
        // TODO: llamar al servicio con req.body y responder 201 con el equipo creado.
        res.status(501).json({
            success: false,
            message: 'El registro de equipos todavía no está implementado.'
        });
    };
    static updateEquipment = (req, res) => {
        const { id } = req.params;
        // TODO: pasar id y req.body a la operación de actualización parcial (estado técnico o ubicación).
        res.status(501).json({
            success: false,
            message: `La actualización del equipo ${id} todavía no está implementada.`
        });
    };
}
exports.EquipmentController = EquipmentController;
