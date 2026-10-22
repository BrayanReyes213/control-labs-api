import { Request, Response, NextFunction } from 'express';
import { ICreateEnvironmentDTO } from '../DTOs/environment.dto';

const isCreateEnvironmentDTO = (value: unknown): value is ICreateEnvironmentDTO => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return false;
    }

    const environment = value as Record<string, unknown>;
    return (
        typeof environment.numero === 'string' && environment.numero.trim() !== '' &&
        typeof environment.capacidad === 'number' && Number.isInteger(environment.capacidad) &&
        typeof environment.equipos === 'number' && Number.isInteger(environment.equipos) &&
        typeof environment.televisores === 'number' && Number.isInteger(environment.televisores)
    );
};

export const validateEnvironmentPayload = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const body: unknown = req.body;
    if (!isCreateEnvironmentDTO(body)) {
        res.status(400).json({
            success: false,
            error: 'Datos del ambiente inválidos.'
        });
        return;
    }
    next();
};
