"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const globalErrorHandler = (err, _req, res, next) => {
    if (res.headersSent) {
        next(err);
        return;
    }
    if (typeof err === 'object' &&
        err !== null &&
        'type' in err &&
        err.type === 'entity.parse.failed') {
        res.status(400).json({
            success: false,
            error: 'El cuerpo JSON está malformado.'
        });
        return;
    }
    console.error(err);
    res.status(500).json({
        status: 'error',
        message: 'Error interno del servidor en ControlLabs',
        timestamp: new Date().toISOString()
    });
};
exports.globalErrorHandler = globalErrorHandler;
