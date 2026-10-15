import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();

router.get('/', UserController.getUsers);
router.post('/', UserController.createUser);
router.get('/:id', UserController.getUserById);
router.patch('/:id', UserController.updateUser);
router.patch('/:id/deactivate', UserController.deleteUser);

export default router;
