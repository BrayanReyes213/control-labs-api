import { ICreateUserDTO, IUpdateUserDTO, UserRole } from '../dtos/user.dto';
import { DomainError } from '../errors/domain.error';
import {
  User,
  UserFilters,
  UserRepository
} from '../repositories/user.repository';

const USER_ROLES: readonly UserRole[] = ['ADMIN', 'GUARDA', 'INSTRUCTOR'];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_NAME_LENGTH = 150;
const MAX_EMAIL_LENGTH = 255;

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async createUser(input: ICreateUserDTO): Promise<User> {
    this.validateName(input.nombre);
    const email = this.normalizeEmail(input.email);
    this.validateEmail(email);
    this.validateRole(input.rol);

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new DomainError(
        'CONFLICT',
        `Ya existe un usuario con el email ${email}.`
      );
    }

    return this.userRepository.create({
      nombre: input.nombre.trim(),
      email,
      rol: input.rol
    });
  }

  public async getUsers(filters: UserFilters = {}): Promise<User[]> {
    if (filters.rol !== undefined) {
      this.validateRole(filters.rol);
    }

    return this.userRepository.findAll({
      rol: filters.rol,
      activo: filters.activo,
      email:
        filters.email !== undefined
          ? this.normalizeEmail(filters.email)
          : undefined
    });
  }

  public async getUserDetail(id: string): Promise<User> {
    this.validateId(id);
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new DomainError(
        'NOT_FOUND',
        `No existe un usuario con identificador ${id}.`
      );
    }
    return user;
  }

  public async updateUser(id: string, input: IUpdateUserDTO): Promise<User> {
    this.validateId(id);
    const currentUser = await this.userRepository.findById(id);
    if (!currentUser) {
      throw new DomainError(
        'NOT_FOUND',
        `No existe un usuario con identificador ${id}.`
      );
    }

    const changes: Partial<ICreateUserDTO> = {};

    if (input.nombre !== undefined) {
      this.validateName(input.nombre);
      changes.nombre = input.nombre.trim();
    }

    if (input.email !== undefined) {
      const email = this.normalizeEmail(input.email);
      this.validateEmail(email);
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser && existingUser.id !== id) {
        throw new DomainError(
          'CONFLICT',
          `Ya existe un usuario con el email ${email}.`
        );
      }
      changes.email = email;
    }

    if (input.rol !== undefined) {
      this.validateRole(input.rol);
      changes.rol = input.rol;
    }

    if (Object.keys(changes).length === 0) {
      throw new DomainError(
        'VALIDATION_ERROR',
        'Debe enviar al menos un campo para actualizar.'
      );
    }

    const updatedUser = await this.userRepository.update(id, changes);
    if (!updatedUser) {
      throw new DomainError(
        'NOT_FOUND',
        `No existe un usuario con identificador ${id}.`
      );
    }
    return updatedUser;
  }

  public async setUserActive(id: string, activo: boolean): Promise<User> {
    this.validateId(id);
    const updatedUser = await this.userRepository.setActive(id, activo);
    if (!updatedUser) {
      throw new DomainError(
        'NOT_FOUND',
        `No existe un usuario con identificador ${id}.`
      );
    }
    return updatedUser;
  }

  private validateName(nombre: string): void {
    if (typeof nombre !== 'string' || nombre.trim() === '') {
      throw new DomainError(
        'VALIDATION_ERROR',
        'El nombre del usuario es obligatorio.'
      );
    }
    if (nombre.trim().length > MAX_NAME_LENGTH) {
      throw new DomainError(
        'VALIDATION_ERROR',
        `El nombre del usuario no puede superar los ${MAX_NAME_LENGTH} caracteres.`
      );
    }
  }

  private validateEmail(email: string): void {
    if (!EMAIL_PATTERN.test(email)) {
      throw new DomainError(
        'VALIDATION_ERROR',
        'El email del usuario no es válido.'
      );
    }
    if (email.length > MAX_EMAIL_LENGTH) {
      throw new DomainError(
        'VALIDATION_ERROR',
        `El email del usuario no puede superar los ${MAX_EMAIL_LENGTH} caracteres.`
      );
    }
  }

  private validateRole(rol: UserRole): void {
    if (!USER_ROLES.includes(rol)) {
      throw new DomainError(
        'VALIDATION_ERROR',
        'El rol debe ser ADMIN, GUARDA o INSTRUCTOR.'
      );
    }
  }

  private validateId(id: string): void {
    if (!UUID_PATTERN.test(id)) {
      throw new DomainError(
        'VALIDATION_ERROR',
        'El identificador del usuario debe ser un UUID válido.'
      );
    }
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }
}
