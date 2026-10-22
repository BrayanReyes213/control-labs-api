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
        typeof environment.equipos === 'string' && environment.equipos.trim() !== '' &&
        typeof environment.televisores === 'string' && environment.televisores.trim() !== ''
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
