export type UserRole = 'ADMIN' | 'GUARDA' | 'INSTRUCTOR';

export interface ICreateUserDTO {
  nombre: string;
  email: string;
  rol: UserRole;
}

export interface IUpdateUserDTO {
  nombre?: string;
  email?: string;
  rol?: UserRole;
}

export interface IUpdateUserActiveDTO {
  activo: boolean;
}
