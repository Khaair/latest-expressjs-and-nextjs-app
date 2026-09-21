import { Router } from 'express';
import * as categoryController from './category.controller';
import { validate } from '../../middleware/validate';
import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdParamSchema,
  listCategoriesQuerySchema,
} from './category.schema';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', validate(listCategoriesQuerySchema, 'query'), categoryController.listCategories);
router.get('/:id', validate(categoryIdParamSchema, 'params'), categoryController.getCategory);
router.post('/', validate(createCategorySchema), categoryController.createCategory);
router.patch(
  '/:id',
  validate(categoryIdParamSchema, 'params'),
  validate(updateCategorySchema),
  categoryController.updateCategory,
);
router.delete('/:id', validate(categoryIdParamSchema, 'params'), categoryController.deleteCategory);

export default router;
