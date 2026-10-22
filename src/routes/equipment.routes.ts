import { Router } from 'express';
import { EquipmentController } from '../controllers/equipment.controller';
import { validateEquipmentPayload } from '../middlewares/validateEquipment.middleware';

const router = Router();

router.get('/search', EquipmentController.getEquipmentsByFilter);
router.post('/', validateEquipmentPayload, EquipmentController.createEquipment);
router.patch('/:id', EquipmentController.updateEquipment);

export default router;
