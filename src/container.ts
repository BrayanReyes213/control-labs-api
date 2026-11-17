import { InMemoryEquipmentRepository } from './repositories/in-memory-equipment.repository';
import { InMemoryLoanRepository } from './repositories/in-memory-loan.repository';
import { InMemoryRoomRepository } from './repositories/in-memory-room.repository';
import { InMemoryUserRepository } from './repositories/in-memory-user.repository';
import { EquipmentService } from './services/equipment.service';
import { LoanService } from './services/loan.service';
import { RoomService } from './services/room.service';
import { UserService } from './services/user.service';

const loanRepository = new InMemoryLoanRepository();
export const loanService = new LoanService(loanRepository);

const userRepository = new InMemoryUserRepository();
export const userService = new UserService(userRepository);

const roomRepository = new InMemoryRoomRepository();
const equipmentRepository = new InMemoryEquipmentRepository();

export const roomService = new RoomService(roomRepository, equipmentRepository);
export const equipmentService = new EquipmentService(
  equipmentRepository,
  roomRepository
);
