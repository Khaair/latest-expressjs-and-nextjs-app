import { Request, Response, NextFunction } from 'express';
import * as userService from './user.service';
import { sendSuccess, sendMessage } from '../../utils/response';
import { AuthenticatedRequest } from '../../types/express.d';
import { ListUsersQuery } from './user.schema';

export async function listUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await userService.listUsers(req.query as unknown as ListUsersQuery);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { user } = req as AuthenticatedRequest;
    const profile = await userService.getUserById(user.id, req.params.id as string);
    sendSuccess(res, { user: profile });
  } catch (error) {
    next(error);
  }
}

export async function createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const created = await userService.createUser(req.body);
    sendSuccess(res, { user: created }, 'User created successfully', 201);
  } catch (error) {
    next(error);
  }
}

export async function updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { user } = req as AuthenticatedRequest;
    const updated = await userService.updateUser(user.id, req.params.id as string, req.body);
    sendSuccess(res, { user: updated }, 'User updated successfully');
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { user } = req as AuthenticatedRequest;
    await userService.deleteUser(user.id, req.params.id as string);
    sendMessage(res, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
}

export async function updateUserStatus(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { user } = req as AuthenticatedRequest;
    const updated = await userService.updateUserStatus(user.id, req.params.id as string, req.body);
    sendSuccess(res, { user: updated }, 'User status updated successfully');
  } catch (error) {
    next(error);
  }
}
