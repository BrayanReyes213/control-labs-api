import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import {
  validateUserActivePayload,
  validateUserPayload,
  validateUserUpdatePayload
} from '../middlewares/validateUser.middleware';

const router = Router();

router.post('/', validateUserPayload, UserController.createUser);
router.get('/', UserController.getUsers);
router.get('/:id', UserController.getUserById);
router.patch('/:id', validateUserUpdatePayload, UserController.updateUser);
router.patch('/:id/active', validateUserActivePayload, UserController.setUserActive);

export default router;
