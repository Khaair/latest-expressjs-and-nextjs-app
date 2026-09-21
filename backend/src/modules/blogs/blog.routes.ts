import { Router } from 'express';
import * as blogController from './blog.controller';
import { validate } from '../../middleware/validate';
import {
  createBlogSchema,
  updateBlogSchema,
  blogIdParamSchema,
  listBlogsQuerySchema,
} from './blog.schema';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', validate(listBlogsQuerySchema, 'query'), blogController.listBlogs);
router.get('/:id', validate(blogIdParamSchema, 'params'), blogController.getBlog);
router.post('/', validate(createBlogSchema), blogController.createBlog);
router.patch(
  '/:id',
  validate(blogIdParamSchema, 'params'),
  validate(updateBlogSchema),
  blogController.updateBlog,
);
router.delete('/:id', validate(blogIdParamSchema, 'params'), blogController.deleteBlog);

export default router;