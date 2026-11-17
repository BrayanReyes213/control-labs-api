import { Router } from 'express';
import { RoomController } from '../controllers/room.controller';
import {
  validateRoomFilters,
  validateRoomIdParam,
  validateRoomPayload,
  validateRoomStatusPayload,
  validateRoomUpdatePayload
} from '../middlewares/validateRoom.middleware';

const router = Router();

router.post('/', validateRoomPayload, RoomController.createRoom);
router.get('/', validateRoomFilters, RoomController.getRooms);
router.get('/:id', validateRoomIdParam, RoomController.getRoomById);
router.patch(
  '/:id/status',
  validateRoomIdParam,
  validateRoomStatusPayload,
  RoomController.updateRoomStatus
);
router.patch(
  '/:id',
  validateRoomIdParam,
  validateRoomUpdatePayload,
  RoomController.updateRoom
);

export default router;
