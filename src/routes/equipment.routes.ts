import { Router } from 'express';
import { EquipmentController } from '../controllers/equipment.controller';

const router = Router();

router.get('/search', EquipmentController.getEquipmentsByFilter);
router.post('/', EquipmentController.createEquipment);
router.patch('/:id', EquipmentController.updateEquipment);

export default router;
