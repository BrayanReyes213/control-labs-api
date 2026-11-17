import { Request, Response } from 'express';
import { equipmentService } from '../container';
import { DomainError } from '../errors/domain.error';
import {
  EquipmentStatus,
  EquipmentType,
  ICreateEquipmentDTO,
  IMoveEquipmentDTO,
  IUpdateEquipmentDTO,
  IUpdateEquipmentStatusDTO
} from '../dtos/equipment.dto';
import { EquipmentFilters } from '../repositories/equipment.repository';

const EQUIPMENT_TYPES: readonly EquipmentType[] = [
  'COMPUTADOR',
  'MOUSE',
  'TECLADO',
  'CARGADOR',
  'TELEVISOR',
  'CONTROL_TV'
];
const EQUIPMENT_STATUSES: readonly EquipmentStatus[] = [
  'OPERATIVO',
  'MANTENIMIENTO',
  'FUERA_DE_SERVICIO'
];

export class EquipmentController {
  public static createEquipment = async (
    req: Request<Record<string, string>, unknown, ICreateEquipmentDTO>,
    res: Response
  ): Promise<void> => {
    const equipment = await equipmentService.createEquipment(req.body);
    res.status(201).json({ success: true, data: equipment });
  };

  public static getEquipments = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { roomId, estado, tipo, placaSena, codigoActivo } = req.query;

    if (roomId !== undefined && typeof roomId !== 'string') {
      throw new DomainError(
        'VALIDATION_ERROR',
        'El filtro roomId debe ser un texto.'
      );
    }
    if (
      estado !== undefined &&
      (typeof estado !== 'string' ||
        !EQUIPMENT_STATUSES.includes(estado as EquipmentStatus))
    ) {
      throw new DomainError(
        'VALIDATION_ERROR',
        'El filtro estado debe ser OPERATIVO, MANTENIMIENTO o FUERA_DE_SERVICIO.'
      );
    }
    if (
      tipo !== undefined &&
      (typeof tipo !== 'string' ||
        !EQUIPMENT_TYPES.includes(tipo as EquipmentType))
    ) {
      throw new DomainError(
        'VALIDATION_ERROR',
        'El filtro tipo no es válido.'
      );
    }
    if (placaSena !== undefined && typeof placaSena !== 'string') {
      throw new DomainError(
        'VALIDATION_ERROR',
        'El filtro placaSena debe ser un texto.'
      );
    }
    if (codigoActivo !== undefined && typeof codigoActivo !== 'string') {
      throw new DomainError(
        'VALIDATION_ERROR',
        'El filtro codigoActivo debe ser un texto.'
      );
    }

    const filters: EquipmentFilters = {
      roomId,
      estado: estado as EquipmentStatus | undefined,
      tipo: tipo as EquipmentType | undefined,
      placaSena,
      codigoActivo
    };

    const equipments = await equipmentService.getEquipments(filters);
    res.status(200).json({ success: true, data: equipments });
  };

  public static getEquipmentById = async (
    req: Request<{ id: string }>,
    res: Response
  ): Promise<void> => {
    const equipment = await equipmentService.getEquipmentDetail(req.params.id);
    res.status(200).json({ success: true, data: equipment });
  };

  public static updateEquipment = async (
    req: Request<{ id: string }, unknown, IUpdateEquipmentDTO>,
    res: Response
  ): Promise<void> => {
    const equipment = await equipmentService.updateEquipment(
      req.params.id,
      req.body
    );
    res.status(200).json({ success: true, data: equipment });
  };

  public static updateEquipmentStatus = async (
    req: Request<{ id: string }, unknown, IUpdateEquipmentStatusDTO>,
    res: Response
  ): Promise<void> => {
    const equipment = await equipmentService.updateEquipmentStatus(
      req.params.id,
      req.body.estado
    );
    res.status(200).json({ success: true, data: equipment });
  };

  public static moveEquipment = async (
    req: Request<{ id: string }, unknown, IMoveEquipmentDTO>,
    res: Response
  ): Promise<void> => {
    const equipment = await equipmentService.moveEquipment(
      req.params.id,
      req.body.roomId
    );
    res.status(200).json({ success: true, data: equipment });
  };
}
