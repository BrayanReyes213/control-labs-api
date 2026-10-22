"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
class UserController {
    static getUsers = (req, res) => {
        // TODO: llamar al servicio y responder con el listado completo de usuarios.
        res.status(501).json({
            success: false,
            message: 'El listado de usuarios todavía no está implementado.'
        });
    };
    static createUser = (req, res) => {
        // TODO: llamar al servicio con req.body y responder 201 con el usuario creado.
        res.status(501).json({
            success: false,
            message: 'El registro de usuarios todavía no está implementado.'
        });
    };
    static getUserById = (req, res) => {
        const { id } = req.params;
        // TODO: pasar id a la operación de consulta y responder con el usuario encontrado.
        res.status(501).json({
            success: false,
            message: `La consulta del usuario ${id} todavía no está implementada.`
        });
    };
    static updateUser = (req, res) => {
        const { id } = req.params;
        // TODO: pasar id y req.body a la operación de actualización parcial (rol, estado o contraseña).
        res.status(501).json({
            success: false,
            message: `La actualización del usuario ${id} todavía no está implementada.`
        });
    };
    static deleteUser = (req, res) => {
        const { id } = req.params;
        // TODO: eliminación lógica: internamente se actualiza el estado del usuario, no se borra el registro.
        res.status(501).json({
            success: false,
            message: `La eliminación del usuario ${id} todavía no está implementada.`
        });
    };
}
exports.UserController = UserController;
