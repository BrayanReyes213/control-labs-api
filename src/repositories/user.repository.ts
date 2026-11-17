import { ICreateUserDTO, UserRole } from '../dtos/user.dto';

export interface User extends ICreateUserDTO {
  id: string;
  activo: boolean;
  createdAt: string;
}

export interface UserFilters {
  rol?: UserRole;
  activo?: boolean;
  email?: string;
}

export interface UserRepository {
  create(input: ICreateUserDTO): Promise<User>;
  findAll(filters?: UserFilters): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, changes: Partial<ICreateUserDTO>): Promise<User | null>;
  setActive(id: string, activo: boolean): Promise<User | null>;
}
