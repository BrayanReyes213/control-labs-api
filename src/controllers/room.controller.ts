import { Request, Response } from 'express';
import { roomService } from '../container';
import { DomainError } from '../errors/domain.error';
import {
  ICreateRoomDTO,
  IUpdateRoomDTO,
  IUpdateRoomStatusDTO,
  RoomStatus
} from '../dtos/room.dto';
import { RoomFilters } from '../repositories/room.repository';

const ROOM_STATUSES: readonly RoomStatus[] = [
  'OPERATIVO',
  'MANTENIMIENTO',
  'INACTIVO'
];

export class RoomController {
  public static createRoom = async (
    req: Request<Record<string, string>, unknown, ICreateRoomDTO>,
    res: Response
  ): Promise<void> => {
    const room = await roomService.createRoom(req.body);
    res.status(201).json({ success: true, data: room });
  };

  public static getRooms = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { nombre, bloque, estado } = req.query;

    if (nombre !== undefined && typeof nombre !== 'string') {
      throw new DomainError(
        'VALIDATION_ERROR',
        'El filtro nombre debe ser un texto.'
      );
    }

    if (bloque !== undefined && typeof bloque !== 'string') {
      throw new DomainError(
        'VALIDATION_ERROR',
        'El filtro bloque debe ser un texto.'
      );
    }

    if (
      estado !== undefined &&
      (typeof estado !== 'string' ||
        !ROOM_STATUSES.includes(estado as RoomStatus))
    ) {
      throw new DomainError(
        'VALIDATION_ERROR',
        'El filtro estado debe ser OPERATIVO, MANTENIMIENTO o INACTIVO.'
      );
    }

    const filters: RoomFilters = {
      nombre,
      bloque,
      estado: estado as RoomStatus | undefined
    };

    const rooms = await roomService.getRooms(filters);
    res.status(200).json({ success: true, data: rooms });
  };

  public static getRoomById = async (
    req: Request<{ id: string }>,
    res: Response
  ): Promise<void> => {
    const room = await roomService.getRoomDetail(req.params.id);
    res.status(200).json({ success: true, data: room });
  };

  public static updateRoom = async (
    req: Request<{ id: string }, unknown, IUpdateRoomDTO>,
    res: Response
  ): Promise<void> => {
    const room = await roomService.updateRoom(req.params.id, req.body);
    res.status(200).json({ success: true, data: room });
  };

  public static updateRoomStatus = async (
    req: Request<{ id: string }, unknown, IUpdateRoomStatusDTO>,
    res: Response
  ): Promise<void> => {
    const room = await roomService.updateRoomStatus(
      req.params.id,
      req.body.estado
    );
    res.status(200).json({ success: true, data: room });
  };
}
