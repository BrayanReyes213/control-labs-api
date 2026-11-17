import { Request, Response } from 'express';
import { userService } from '../container';
import { DomainError } from '../errors/domain.error';
import {
  ICreateUserDTO,
  IUpdateUserActiveDTO,
  IUpdateUserDTO,
  UserRole
} from '../dtos/user.dto';
import { UserFilters } from '../repositories/user.repository';

const USER_ROLES: readonly UserRole[] = ['ADMIN', 'GUARDA', 'INSTRUCTOR'];

export class UserController {
  public static createUser = async (
    req: Request<Record<string, string>, unknown, ICreateUserDTO>,
    res: Response
  ): Promise<void> => {
    const user = await userService.createUser(req.body);
    res.status(201).json({ success: true, data: user });
  };

  public static getUsers = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { rol, activo, email } = req.query;

    if (
      rol !== undefined &&
      (typeof rol !== 'string' || !USER_ROLES.includes(rol as UserRole))
    ) {
      throw new DomainError(
        'VALIDATION_ERROR',
        'El filtro rol debe ser ADMIN, GUARDA o INSTRUCTOR.'
      );
    }

    if (
      activo !== undefined &&
      (typeof activo !== 'string' ||
        (activo !== 'true' && activo !== 'false'))
    ) {
      throw new DomainError(
        'VALIDATION_ERROR',
        'El filtro activo debe ser true o false.'
      );
    }

    if (email !== undefined && typeof email !== 'string') {
      throw new DomainError(
        'VALIDATION_ERROR',
        'El filtro email debe ser un texto.'
      );
    }

    const filters: UserFilters = {
      rol: rol as UserRole | undefined,
      activo: activo === undefined ? undefined : activo === 'true',
      email
    };

    const users = await userService.getUsers(filters);
    res.status(200).json({ success: true, data: users });
  };

  public static getUserById = async (
    req: Request<{ id: string }>,
    res: Response
  ): Promise<void> => {
    const user = await userService.getUserDetail(req.params.id);
    res.status(200).json({ success: true, data: user });
  };

  public static updateUser = async (
    req: Request<{ id: string }, unknown, IUpdateUserDTO>,
    res: Response
  ): Promise<void> => {
    const user = await userService.updateUser(req.params.id, req.body);
    res.status(200).json({ success: true, data: user });
  };

  public static setUserActive = async (
    req: Request<{ id: string }, unknown, IUpdateUserActiveDTO>,
    res: Response
  ): Promise<void> => {
    const user = await userService.setUserActive(req.params.id, req.body.activo);
    res.status(200).json({ success: true, data: user });
  };
}
