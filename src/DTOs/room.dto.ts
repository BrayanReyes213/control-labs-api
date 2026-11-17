export type RoomStatus = 'OPERATIVO' | 'MANTENIMIENTO' | 'INACTIVO';

export interface ICreateRoomDTO {
  nombre: string;
  bloque: string;
  capacidadPcs: number;
}

export interface IUpdateRoomDTO {
  nombre?: string;
  bloque?: string;
  capacidadPcs?: number;
}

export interface IUpdateRoomStatusDTO {
  estado: RoomStatus;
}
