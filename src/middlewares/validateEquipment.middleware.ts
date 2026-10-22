import { Request, Response, NextFunction } from 'express';
import { ICreateEquipmentDTO } from '../dtos/equipment.dto';

const isCreateEquipmentDTO = (value: unknown): value is ICreateEquipmentDTO => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return false;
    }

    const equipment = value as Record<string, unknown>;
    return (
        typeof equipment.codigo === 'string' && equipment.codigo.trim() !== '' &&
        typeof equipment.teclado === 'boolean' &&
        typeof equipment.mouse === 'boolean' &&
        typeof equipment.pantalla === 'boolean' &&
        typeof equipment.cables === 'boolean'
    );
};

export const validateEquipmentPayload = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const body: unknown = req.body;
    if (!isCreateEquipmentDTO(body)) {
        res.status(400).json({
            success: false,
            error: 'Datos del equipo inválidos.'
        });
        return;
    }
    next();
};
