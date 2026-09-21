import { Request, Response, NextFunction } from 'express';
import * as categoryService from './category.service';
import { sendSuccess, sendMessage } from '../../utils/response';
import { ListCategoriesQuery } from './category.schema';

export async function listCategories(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await categoryService.listCategories(
      req.query as unknown as ListCategoriesQuery,
    );
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function getCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const category = await categoryService.getCategoryById(req.params.id as string);
    sendSuccess(res, { category });
  } catch (error) {
    next(error);
  }
}

export async function createCategory(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const category = await categoryService.createCategory(req.body);
    sendSuccess(res, { category }, 'Category created successfully', 201);
  } catch (error) {
    next(error);
  }
}

export async function updateCategory(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const category = await categoryService.updateCategory(req.params.id as string, req.body);
    sendSuccess(res, { category }, 'Category updated successfully');
  } catch (error) {
    next(error);
  }
}

export async function deleteCategory(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await categoryService.deleteCategory(req.params.id as string);
    sendMessage(res, 'Category deleted successfully');
  } catch (error) {
    next(error);
  }
}
