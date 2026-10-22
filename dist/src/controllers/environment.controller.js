"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentController = void 0;
class EnvironmentController {
    static getEnvironments = (req, res) => {
        // TODO: llamar al servicio y responder con el listado completo de ambientes.
        res.status(501).json({
            success: false,
            message: 'El listado de ambientes todavía no está implementado.'
        });
    };
    static createEnvironment = (req, res) => {
        // TODO: llamar al servicio con req.body y responder 201 con el ambiente creado.
        res.status(501).json({
            success: false,
            message: 'El registro de ambientes todavía no está implementado.'
        });
    };
    static updateEnvironment = (req, res) => {
        const { id } = req.params;
        // TODO: pasar id y req.body a la operación de actualización parcial (capacidad o estado operativo).
        res.status(501).json({
            success: false,
            message: `La actualización del ambiente ${id} todavía no está implementada.`
        });
    };
}
exports.EnvironmentController = EnvironmentController;
