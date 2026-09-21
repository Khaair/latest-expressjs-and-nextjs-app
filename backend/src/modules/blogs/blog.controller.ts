import { Request, Response, NextFunction } from 'express';
import * as blogService from './blog.service';
import { sendSuccess, sendMessage } from '../../utils/response';
import { AuthenticatedRequest } from '../../types/express.d';
import { ListBlogsQuery } from './blog.schema';

export async function listBlogs(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await blogService.listBlogs(req.query as unknown as ListBlogsQuery);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function getBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const blog = await blogService.getBlogById(req.params.id as string);
    sendSuccess(res, { blog });
  } catch (error) {
    next(error);
  }
}

export async function createBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { user } = req as AuthenticatedRequest;
    const blog = await blogService.createBlog(user.id, req.body);
    sendSuccess(res, { blog }, 'Blog created successfully', 201);
  } catch (error) {
    next(error);
  }
}

export async function updateBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const blog = await blogService.updateBlog(req.params.id as string, req.body);
    sendSuccess(res, { blog }, 'Blog updated successfully');
  } catch (error) {
    next(error);
  }
}

export async function deleteBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await blogService.deleteBlog(req.params.id as string);
    sendMessage(res, 'Blog deleted successfully');
  } catch (error) {
    next(error);
  }
}