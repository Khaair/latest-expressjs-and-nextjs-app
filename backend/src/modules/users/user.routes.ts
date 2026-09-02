import { Router } from 'express';
import * as userController from './user.controller';
import { validate } from '../../middleware/validate';
import {
  createUserSchema,
  updateUserSchema,
  userIdParamSchema,
  listUsersQuerySchema,
  updateUserStatusSchema,
} from './user.schema';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', validate(listUsersQuerySchema, 'query'), userController.listUsers);
router.get('/:id', validate(userIdParamSchema, 'params'), userController.getUser);
router.post('/', validate(createUserSchema), userController.createUser);
router.patch(
  '/:id',
  validate(userIdParamSchema, 'params'),
  validate(updateUserSchema),
  userController.updateUser,
);
router.delete('/:id', validate(userIdParamSchema, 'params'), userController.deleteUser);
router.patch(
  '/:id/status',
  validate(userIdParamSchema, 'params'),
  validate(updateUserStatusSchema),
  userController.updateUserStatus,
);

export default router;
