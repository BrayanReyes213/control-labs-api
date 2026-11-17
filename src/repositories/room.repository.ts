import { ICreateRoomDTO, RoomStatus } from '../dtos/room.dto';

export interface Room extends ICreateRoomDTO {
  id: string;
  estado: RoomStatus;
}

export interface RoomFilters {
  nombre?: string;
  bloque?: string;
  estado?: RoomStatus;
}

export interface RoomRepository {
  create(input: ICreateRoomDTO): Promise<Room>;
  findAll(filters?: RoomFilters): Promise<Room[]>;
  findById(id: string): Promise<Room | null>;
  findByName(nombre: string): Promise<Room | null>;
  update(id: string, changes: Partial<ICreateRoomDTO>): Promise<Room | null>;
  updateStatus(id: string, estado: RoomStatus): Promise<Room | null>;
}
