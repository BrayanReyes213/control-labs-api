import {
  EquipmentStatus,
  EquipmentType,
  ICreateEquipmentDTO
} from '../dtos/equipment.dto';

export interface Equipment extends ICreateEquipmentDTO {
  id: string;
  estado: EquipmentStatus;
}

export type EquipmentUpdate = Partial<
  Pick<ICreateEquipmentDTO, 'placaSena' | 'codigoActivo' | 'tipo'>
>;

export interface EquipmentFilters {
  roomId?: string;
  estado?: EquipmentStatus;
  tipo?: EquipmentType;
  placaSena?: string;
  codigoActivo?: string;
}

export interface EquipmentRepository {
  create(input: ICreateEquipmentDTO): Promise<Equipment>;
  findAll(filters?: EquipmentFilters): Promise<Equipment[]>;
  findById(id: string): Promise<Equipment | null>;
  findByPlacaSena(placaSena: string): Promise<Equipment | null>;
  findByCodigoActivo(codigoActivo: string): Promise<Equipment | null>;
  update(id: string, changes: EquipmentUpdate): Promise<Equipment | null>;
  updateStatus(
    id: string,
    estado: EquipmentStatus
  ): Promise<Equipment | null>;
  move(id: string, roomId: string): Promise<Equipment | null>;
  countByRoomAndType(roomId: string, tipo: EquipmentType): Promise<number>;
}
