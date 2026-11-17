import { randomUUID } from 'crypto';
import {
  EquipmentStatus,
  EquipmentType,
  ICreateEquipmentDTO
} from '../dtos/equipment.dto';
import {
  Equipment,
  EquipmentFilters,
  EquipmentRepository,
  EquipmentUpdate
} from './equipment.repository';

export class InMemoryEquipmentRepository implements EquipmentRepository {
  private readonly equipments = new Map<string, Equipment>();

  public async create(input: ICreateEquipmentDTO): Promise<Equipment> {
    const equipment: Equipment = {
      ...input,
      id: randomUUID(),
      estado: 'OPERATIVO'
    };
    this.equipments.set(equipment.id, equipment);
    return { ...equipment };
  }

  public async findAll(
    filters: EquipmentFilters = {}
  ): Promise<Equipment[]> {
    const normalizedRoomId = filters.roomId?.toLowerCase();
    const normalizedPlate = filters.placaSena?.toLowerCase();
    const normalizedCode = filters.codigoActivo?.toLowerCase();
    return Array.from(this.equipments.values())
      .filter(
        (equipment) =>
          (!normalizedRoomId ||
            equipment.roomId.toLowerCase() === normalizedRoomId) &&
          (filters.estado === undefined ||
            equipment.estado === filters.estado) &&
          (filters.tipo === undefined || equipment.tipo === filters.tipo) &&
          (!normalizedPlate ||
            equipment.placaSena.toLowerCase().includes(normalizedPlate)) &&
          (!normalizedCode ||
            equipment.codigoActivo.toLowerCase().includes(normalizedCode))
      )
      .map((equipment) => ({ ...equipment }));
  }

  public async findById(id: string): Promise<Equipment | null> {
    const equipment = this.equipments.get(id);
    return equipment ? { ...equipment } : null;
  }

  public async findByPlacaSena(
    placaSena: string
  ): Promise<Equipment | null> {
    const normalizedPlate = placaSena.toLowerCase();
    const equipment = Array.from(this.equipments.values()).find(
      (candidate) => candidate.placaSena.toLowerCase() === normalizedPlate
    );
    return equipment ? { ...equipment } : null;
  }

  public async findByCodigoActivo(
    codigoActivo: string
  ): Promise<Equipment | null> {
    const normalizedCode = codigoActivo.toLowerCase();
    const equipment = Array.from(this.equipments.values()).find(
      (candidate) => candidate.codigoActivo.toLowerCase() === normalizedCode
    );
    return equipment ? { ...equipment } : null;
  }

  public async update(
    id: string,
    changes: EquipmentUpdate
  ): Promise<Equipment | null> {
    const equipment = this.equipments.get(id);
    if (!equipment) {
      return null;
    }

    const updated: Equipment = {
      ...equipment,
      ...changes
    };
    this.equipments.set(id, updated);
    return { ...updated };
  }

  public async updateStatus(
    id: string,
    estado: EquipmentStatus
  ): Promise<Equipment | null> {
    const equipment = this.equipments.get(id);
    if (!equipment) {
      return null;
    }

    const updated: Equipment = {
      ...equipment,
      estado
    };
    this.equipments.set(id, updated);
    return { ...updated };
  }

  public async move(
    id: string,
    roomId: string
  ): Promise<Equipment | null> {
    const equipment = this.equipments.get(id);
    if (!equipment) {
      return null;
    }

    const updated: Equipment = {
      ...equipment,
      roomId
    };
    this.equipments.set(id, updated);
    return { ...updated };
  }

  public async countByRoomAndType(
    roomId: string,
    tipo: EquipmentType
  ): Promise<number> {
    const normalizedRoomId = roomId.toLowerCase();
    return Array.from(this.equipments.values()).filter(
      (equipment) =>
        equipment.roomId.toLowerCase() === normalizedRoomId &&
        equipment.tipo === tipo
    ).length;
  }
}
