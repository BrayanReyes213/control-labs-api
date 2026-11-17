import { randomUUID } from 'crypto';
import { ICreateUserDTO } from '../dtos/user.dto';
import { User, UserFilters, UserRepository } from './user.repository';

export class InMemoryUserRepository implements UserRepository {
  private readonly users = new Map<string, User>();

  public async create(input: ICreateUserDTO): Promise<User> {
    const user: User = {
      ...input,
      email: input.email.toLowerCase(),
      id: randomUUID(),
      activo: true,
      createdAt: new Date().toISOString()
    };
    this.users.set(user.id, user);
    return { ...user };
  }

  public async findAll(filters: UserFilters = {}): Promise<User[]> {
    const normalizedEmail = filters.email?.toLowerCase();
    return Array.from(this.users.values())
      .filter(
        (user) =>
          (filters.rol === undefined || user.rol === filters.rol) &&
          (filters.activo === undefined || user.activo === filters.activo) &&
          (!normalizedEmail || user.email.toLowerCase() === normalizedEmail)
      )
      .map((user) => ({ ...user }));
  }

  public async findById(id: string): Promise<User | null> {
    const user = this.users.get(id);
    return user ? { ...user } : null;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const normalizedEmail = email.toLowerCase();
    const user = Array.from(this.users.values()).find(
      (candidate) => candidate.email.toLowerCase() === normalizedEmail
    );
    return user ? { ...user } : null;
  }

  public async update(
    id: string,
    changes: Partial<ICreateUserDTO>
  ): Promise<User | null> {
    const user = this.users.get(id);
    if (!user) {
      return null;
    }

    const updated: User = {
      ...user,
      ...changes,
      email: changes.email?.toLowerCase() ?? user.email
    };
    this.users.set(id, updated);
    return { ...updated };
  }

  public async setActive(id: string, activo: boolean): Promise<User | null> {
    const user = this.users.get(id);
    if (!user) {
      return null;
    }

    const updated: User = {
      ...user,
      activo
    };
    this.users.set(id, updated);
    return { ...updated };
  }
}
