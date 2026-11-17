import { Router } from 'express';
import { EquipmentController } from '../controllers/equipment.controller';
import {
  validateEquipmentFilters,
  validateEquipmentIdParam,
  validateEquipmentMovePayload,
  validateEquipmentPayload,
  validateEquipmentStatusPayload,
  validateEquipmentUpdatePayload
} from '../middlewares/validateEquipment.middleware';

const router = Router();

router.post('/', validateEquipmentPayload, EquipmentController.createEquipment);
router.get('/', validateEquipmentFilters, EquipmentController.getEquipments);
router.get(
  '/:id',
  validateEquipmentIdParam,
  EquipmentController.getEquipmentById
);
router.patch(
  '/:id/status',
  validateEquipmentIdParam,
  validateEquipmentStatusPayload,
  EquipmentController.updateEquipmentStatus
);
router.patch(
  '/:id/move',
  validateEquipmentIdParam,
  validateEquipmentMovePayload,
  EquipmentController.moveEquipment
);
router.patch(
  '/:id',
  validateEquipmentIdParam,
  validateEquipmentUpdatePayload,
  EquipmentController.updateEquipment
);

export default router;
