import { randomUUID } from 'crypto';
import { ICreateRoomDTO, RoomStatus } from '../dtos/room.dto';
import { Room, RoomFilters, RoomRepository } from './room.repository';

export class InMemoryRoomRepository implements RoomRepository {
  private readonly rooms = new Map<string, Room>();

  public async create(input: ICreateRoomDTO): Promise<Room> {
    const room: Room = {
      ...input,
      id: randomUUID(),
      estado: 'OPERATIVO'
    };
    this.rooms.set(room.id, room);
    return { ...room };
  }

  public async findAll(filters: RoomFilters = {}): Promise<Room[]> {
    const normalizedName = filters.nombre?.toLowerCase();
    const normalizedBlock = filters.bloque?.toLowerCase();
    return Array.from(this.rooms.values())
      .filter(
        (room) =>
          (!normalizedName ||
            room.nombre.toLowerCase().includes(normalizedName)) &&
          (!normalizedBlock ||
            room.bloque.toLowerCase().includes(normalizedBlock)) &&
          (filters.estado === undefined || room.estado === filters.estado)
      )
      .map((room) => ({ ...room }));
  }

  public async findById(id: string): Promise<Room | null> {
    const room = this.rooms.get(id);
    return room ? { ...room } : null;
  }

  public async findByName(nombre: string): Promise<Room | null> {
    const normalizedName = nombre.toLowerCase();
    const room = Array.from(this.rooms.values()).find(
      (candidate) => candidate.nombre.toLowerCase() === normalizedName
    );
    return room ? { ...room } : null;
  }

  public async update(
    id: string,
    changes: Partial<ICreateRoomDTO>
  ): Promise<Room | null> {
    const room = this.rooms.get(id);
    if (!room) {
      return null;
    }

    const updated: Room = {
      ...room,
      ...changes
    };
    this.rooms.set(id, updated);
    return { ...updated };
  }

  public async updateStatus(
    id: string,
    estado: RoomStatus
  ): Promise<Room | null> {
    const room = this.rooms.get(id);
    if (!room) {
      return null;
    }

    const updated: Room = {
      ...room,
      estado
    };
    this.rooms.set(id, updated);
    return { ...updated };
  }
}
