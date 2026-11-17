export type EquipmentType =
  | 'COMPUTADOR'
  | 'MOUSE'
  | 'TECLADO'
  | 'CARGADOR'
  | 'TELEVISOR'
  | 'CONTROL_TV';

export type EquipmentStatus =
  | 'OPERATIVO'
  | 'MANTENIMIENTO'
  | 'FUERA_DE_SERVICIO';

export interface ICreateEquipmentDTO {
  placaSena: string;
  codigoActivo: string;
  tipo: EquipmentType;
  roomId: string;
}

export interface IUpdateEquipmentDTO {
  placaSena?: string;
  codigoActivo?: string;
  tipo?: EquipmentType;
}

export interface IUpdateEquipmentStatusDTO {
  estado: EquipmentStatus;
}

export interface IMoveEquipmentDTO {
  roomId: string;
}
