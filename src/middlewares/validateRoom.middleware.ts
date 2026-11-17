import { Request, Response, NextFunction } from 'express';
import { ICreateRoomDTO } from '../dtos/room.dto';

const isCreateRoomDTO = (value: unknown): value is ICreateRoomDTO => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return false;
    }

    const room = value as Record<string, unknown>;
    return (
        typeof room.numero === 'string' && room.numero.trim() !== '' &&
        typeof room.capacidad === 'number' && Number.isInteger(room.capacidad) &&
        typeof room.equipos === 'number' && Number.isInteger(room.equipos) &&
        typeof room.televisores === 'number' && Number.isInteger(room.televisores)
    );
};

export const validateRoomPayload = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const body: unknown = req.body;
    if (!isCreateRoomDTO(body)) {
        res.status(400).json({
            success: false,
            error: 'Datos del ambiente inválidos.'
        });
        return;
    }
    next();
};
