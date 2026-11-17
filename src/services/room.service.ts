import { ICreateRoomDTO, IUpdateRoomDTO, RoomStatus } from '../dtos/room.dto';
import { DomainError } from '../errors/domain.error';
import { EquipmentRepository } from '../repositories/equipment.repository';
import {
  Room,
  RoomFilters,
  RoomRepository
} from '../repositories/room.repository';

const ROOM_STATUSES: readonly RoomStatus[] = [
  'OPERATIVO',
  'MANTENIMIENTO',
  'INACTIVO'
];
const MAX_NAME_LENGTH = 100;
const MAX_BLOCK_LENGTH = 50;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class RoomService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly equipmentRepository: EquipmentRepository
  ) {}

  public async createRoom(input: ICreateRoomDTO): Promise<Room> {
    this.validateName(input.nombre);
    this.validateBlock(input.bloque);
    this.validateCapacity(input.capacidadPcs);

    const nombre = input.nombre.trim();
    const existingRoom = await this.roomRepository.findByName(nombre);
    if (existingRoom) {
      throw new DomainError(
        'CONFLICT',
        `Ya existe un ambiente con el nombre ${nombre}.`
      );
    }

    return this.roomRepository.create({
      nombre,
      bloque: input.bloque.trim(),
      capacidadPcs: input.capacidadPcs
    });
  }

  public async getRooms(filters: RoomFilters = {}): Promise<Room[]> {
    if (filters.estado !== undefined) {
      this.validateStatus(filters.estado);
    }

    return this.roomRepository.findAll({
      nombre: filters.nombre?.trim(),
      bloque: filters.bloque?.trim(),
      estado: filters.estado
    });
  }

  public async getRoomDetail(id: string): Promise<Room> {
    this.validateId(id);
    const room = await this.roomRepository.findById(id);
    if (!room) {
      throw new DomainError(
        'NOT_FOUND',
        `No existe un ambiente con identificador ${id}.`
      );
    }
    return room;
  }

  public async updateRoom(id: string, input: IUpdateRoomDTO): Promise<Room> {
    this.validateId(id);
    const currentRoom = await this.roomRepository.findById(id);
    if (!currentRoom) {
      throw new DomainError(
        'NOT_FOUND',
        `No existe un ambiente con identificador ${id}.`
      );
    }

    const changes: Partial<ICreateRoomDTO> = {};

    if (input.nombre !== undefined) {
      this.validateName(input.nombre);
      const nombre = input.nombre.trim();
      const existingRoom = await this.roomRepository.findByName(nombre);
      if (existingRoom && existingRoom.id !== id) {
        throw new DomainError(
          'CONFLICT',
          `Ya existe un ambiente con el nombre ${nombre}.`
        );
      }
      changes.nombre = nombre;
    }

    if (input.bloque !== undefined) {
      this.validateBlock(input.bloque);
      changes.bloque = input.bloque.trim();
    }

    if (input.capacidadPcs !== undefined) {
      this.validateCapacity(input.capacidadPcs);
      const installedComputers =
        await this.equipmentRepository.countByRoomAndType(id, 'COMPUTADOR');
      if (input.capacidadPcs < installedComputers) {
        throw new DomainError(
          'CONFLICT',
          `No se puede reducir la capacidad por debajo de los ${installedComputers} computadores instalados.`
        );
      }
      changes.capacidadPcs = input.capacidadPcs;
    }

    if (Object.keys(changes).length === 0) {
      throw new DomainError(
        'VALIDATION_ERROR',
        'Debe enviar al menos un campo para actualizar.'
      );
    }

    const updatedRoom = await this.roomRepository.update(id, changes);
    if (!updatedRoom) {
      throw new DomainError(
        'NOT_FOUND',
        `No existe un ambiente con identificador ${id}.`
      );
    }
    return updatedRoom;
  }

  public async updateRoomStatus(
    id: string,
    estado: RoomStatus
  ): Promise<Room> {
    this.validateId(id);
    this.validateStatus(estado);
    const updatedRoom = await this.roomRepository.updateStatus(id, estado);
    if (!updatedRoom) {
      throw new DomainError(
        'NOT_FOUND',
        `No existe un ambiente con identificador ${id}.`
      );
    }
    return updatedRoom;
  }

  private validateName(nombre: string): void {
    if (typeof nombre !== 'string' || nombre.trim() === '') {
      throw new DomainError(
        'VALIDATION_ERROR',
        'El nombre del ambiente es obligatorio.'
      );
    }
    if (nombre.trim().length > MAX_NAME_LENGTH) {
      throw new DomainError(
        'VALIDATION_ERROR',
        `El nombre del ambiente no puede superar los ${MAX_NAME_LENGTH} caracteres.`
      );
    }
  }

  private validateBlock(bloque: string): void {
    if (typeof bloque !== 'string' || bloque.trim() === '') {
      throw new DomainError(
        'VALIDATION_ERROR',
        'El bloque del ambiente es obligatorio.'
      );
    }
    if (bloque.trim().length > MAX_BLOCK_LENGTH) {
      throw new DomainError(
        'VALIDATION_ERROR',
        `El bloque del ambiente no puede superar los ${MAX_BLOCK_LENGTH} caracteres.`
      );
    }
  }

  private validateCapacity(capacidadPcs: number): void {
    if (!Number.isInteger(capacidadPcs) || capacidadPcs < 0) {
      throw new DomainError(
        'VALIDATION_ERROR',
        'La capacidad de PCs debe ser un entero mayor o igual a 0.'
      );
    }
  }

  private validateStatus(estado: RoomStatus): void {
    if (!ROOM_STATUSES.includes(estado)) {
      throw new DomainError(
        'VALIDATION_ERROR',
        'El estado debe ser OPERATIVO, MANTENIMIENTO o INACTIVO.'
      );
    }
  }

  private validateId(id: string): void {
    if (!UUID_PATTERN.test(id)) {
      throw new DomainError(
        'VALIDATION_ERROR',
        'El identificador del ambiente debe ser un UUID válido.'
      );
    }
  }
}
