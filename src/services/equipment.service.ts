import {
  EquipmentStatus,
  EquipmentType,
  ICreateEquipmentDTO,
  IUpdateEquipmentDTO
} from '../dtos/equipment.dto';
import { DomainError } from '../errors/domain.error';
import {
  Equipment,
  EquipmentFilters,
  EquipmentRepository,
  EquipmentUpdate
} from '../repositories/equipment.repository';
import { RoomRepository } from '../repositories/room.repository';

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
const CAPACITY_TYPE: EquipmentType = 'COMPUTADOR';
const MAX_PLATE_LENGTH = 50;
const MAX_CODE_LENGTH = 100;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class EquipmentService {
  constructor(
    private readonly equipmentRepository: EquipmentRepository,
    private readonly roomRepository: RoomRepository
  ) {}

  public async createEquipment(
    input: ICreateEquipmentDTO
  ): Promise<Equipment> {
    this.validatePlate(input.placaSena);
    this.validateCode(input.codigoActivo);
    this.validateType(input.tipo);
    this.validateId(input.roomId);

    const placaSena = input.placaSena.trim();
    const codigoActivo = input.codigoActivo.trim();

    const existingPlate =
      await this.equipmentRepository.findByPlacaSena(placaSena);
    if (existingPlate) {
      throw new DomainError(
        'CONFLICT',
        `Ya existe un equipo con la placa SENA ${placaSena}.`
      );
    }

    const existingCode =
      await this.equipmentRepository.findByCodigoActivo(codigoActivo);
    if (existingCode) {
      throw new DomainError(
        'CONFLICT',
        `Ya existe un equipo con el código de activo ${codigoActivo}.`
      );
    }

    await this.ensureAvailableRoom(input.roomId, input.tipo);

    return this.equipmentRepository.create({
      placaSena,
      codigoActivo,
      tipo: input.tipo,
      roomId: input.roomId
    });
  }

  public async getEquipments(
    filters: EquipmentFilters = {}
  ): Promise<Equipment[]> {
    if (filters.estado !== undefined) {
      this.validateStatus(filters.estado);
    }
    if (filters.tipo !== undefined) {
      this.validateType(filters.tipo);
    }
    if (filters.roomId !== undefined) {
      this.validateId(filters.roomId);
    }

    return this.equipmentRepository.findAll({
      roomId: filters.roomId,
      estado: filters.estado,
      tipo: filters.tipo,
      placaSena: filters.placaSena?.trim(),
      codigoActivo: filters.codigoActivo?.trim()
    });
  }

  public async getEquipmentDetail(id: string): Promise<Equipment> {
    this.validateId(id);
    const equipment = await this.equipmentRepository.findById(id);
    if (!equipment) {
      throw new DomainError(
        'NOT_FOUND',
        `No existe un equipo con identificador ${id}.`
      );
    }
    return equipment;
  }

  public async updateEquipment(
    id: string,
    input: IUpdateEquipmentDTO
  ): Promise<Equipment> {
    this.validateId(id);
    const currentEquipment = await this.equipmentRepository.findById(id);
    if (!currentEquipment) {
      throw new DomainError(
        'NOT_FOUND',
        `No existe un equipo con identificador ${id}.`
      );
    }

    const changes: EquipmentUpdate = {};

    if (input.placaSena !== undefined) {
      this.validatePlate(input.placaSena);
      const placaSena = input.placaSena.trim();
      const existingPlate =
        await this.equipmentRepository.findByPlacaSena(placaSena);
      if (existingPlate && existingPlate.id !== id) {
        throw new DomainError(
          'CONFLICT',
          `Ya existe un equipo con la placa SENA ${placaSena}.`
        );
      }
      changes.placaSena = placaSena;
    }

    if (input.codigoActivo !== undefined) {
      this.validateCode(input.codigoActivo);
      const codigoActivo = input.codigoActivo.trim();
      const existingCode =
        await this.equipmentRepository.findByCodigoActivo(codigoActivo);
      if (existingCode && existingCode.id !== id) {
        throw new DomainError(
          'CONFLICT',
          `Ya existe un equipo con el código de activo ${codigoActivo}.`
        );
      }
      changes.codigoActivo = codigoActivo;
    }

    if (input.tipo !== undefined) {
      this.validateType(input.tipo);
      changes.tipo = input.tipo;
    }

    if (Object.keys(changes).length === 0) {
      throw new DomainError(
        'VALIDATION_ERROR',
        'Debe enviar al menos un campo para actualizar.'
      );
    }

    const updatedEquipment = await this.equipmentRepository.update(
      id,
      changes
    );
    if (!updatedEquipment) {
      throw new DomainError(
        'NOT_FOUND',
        `No existe un equipo con identificador ${id}.`
      );
    }
    return updatedEquipment;
  }

  public async updateEquipmentStatus(
    id: string,
    estado: EquipmentStatus
  ): Promise<Equipment> {
    this.validateId(id);
    this.validateStatus(estado);
    const updatedEquipment = await this.equipmentRepository.updateStatus(
      id,
      estado
    );
    if (!updatedEquipment) {
      throw new DomainError(
        'NOT_FOUND',
        `No existe un equipo con identificador ${id}.`
      );
    }
    return updatedEquipment;
  }

  public async moveEquipment(
    id: string,
    roomId: string
  ): Promise<Equipment> {
    this.validateId(id);
    this.validateId(roomId);

    const equipment = await this.equipmentRepository.findById(id);
    if (!equipment) {
      throw new DomainError(
        'NOT_FOUND',
        `No existe un equipo con identificador ${id}.`
      );
    }

    if (equipment.estado === 'FUERA_DE_SERVICIO') {
      throw new DomainError(
        'CONFLICT',
        'Un equipo fuera de servicio no puede trasladarse.'
      );
    }

    if (equipment.roomId.toLowerCase() === roomId.toLowerCase()) {
      return equipment;
    }

    await this.ensureAvailableRoom(roomId, equipment.tipo);

    const movedEquipment = await this.equipmentRepository.move(id, roomId);
    if (!movedEquipment) {
      throw new DomainError(
        'NOT_FOUND',
        `No existe un equipo con identificador ${id}.`
      );
    }
    return movedEquipment;
  }

  private async ensureAvailableRoom(
    roomId: string,
    tipo: EquipmentType
  ): Promise<void> {
    const room = await this.roomRepository.findById(roomId);
    if (!room) {
      throw new DomainError(
        'NOT_FOUND',
        `No existe un ambiente con identificador ${roomId}.`
      );
    }

    if (room.estado !== 'OPERATIVO') {
      throw new DomainError(
        'CONFLICT',
        'El ambiente de destino no está operativo.'
      );
    }

    if (tipo === CAPACITY_TYPE) {
      const installed = await this.equipmentRepository.countByRoomAndType(
        roomId,
        CAPACITY_TYPE
      );
      if (installed >= room.capacidadPcs) {
        throw new DomainError(
          'CONFLICT',
          'El ambiente de destino no tiene capacidad disponible para más computadores.'
        );
      }
    }
  }

  private validatePlate(placaSena: string): void {
    if (typeof placaSena !== 'string' || placaSena.trim() === '') {
      throw new DomainError(
        'VALIDATION_ERROR',
        'La placa SENA del equipo es obligatoria.'
      );
    }
    if (placaSena.trim().length > MAX_PLATE_LENGTH) {
      throw new DomainError(
        'VALIDATION_ERROR',
        `La placa SENA no puede superar los ${MAX_PLATE_LENGTH} caracteres.`
      );
    }
  }

  private validateCode(codigoActivo: string): void {
    if (typeof codigoActivo !== 'string' || codigoActivo.trim() === '') {
      throw new DomainError(
        'VALIDATION_ERROR',
        'El código de activo del equipo es obligatorio.'
      );
    }
    if (codigoActivo.trim().length > MAX_CODE_LENGTH) {
      throw new DomainError(
        'VALIDATION_ERROR',
        `El código de activo no puede superar los ${MAX_CODE_LENGTH} caracteres.`
      );
    }
  }

  private validateType(tipo: EquipmentType): void {
    if (!EQUIPMENT_TYPES.includes(tipo)) {
      throw new DomainError(
        'VALIDATION_ERROR',
        'El tipo de equipo no es válido.'
      );
    }
  }

  private validateStatus(estado: EquipmentStatus): void {
    if (!EQUIPMENT_STATUSES.includes(estado)) {
      throw new DomainError(
        'VALIDATION_ERROR',
        'El estado debe ser OPERATIVO, MANTENIMIENTO o FUERA_DE_SERVICIO.'
      );
    }
  }

  private validateId(id: string): void {
    if (!UUID_PATTERN.test(id)) {
      throw new DomainError(
        'VALIDATION_ERROR',
        'El identificador debe ser un UUID válido.'
      );
    }
  }
}
