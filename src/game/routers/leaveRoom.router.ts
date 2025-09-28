import { Router } from "express";
import { LeaveRoomService } from "../services/leaveRoom.service.ts";
import { LeaveRoomController } from "../controllers/leaveRoom.controller.ts";
import { roomRepo, membershipRepo } from "../../shared/container.ts";

const service = new LeaveRoomService(roomRepo, membershipRepo);
const controller = new LeaveRoomController(service);

const router = Router();

router.post("/leave-room", controller.handle);

export default router;
