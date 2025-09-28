import { Router } from "express";
import { CloseRoomService } from "../services/closeRoom.service.ts";
import { CloseRoomController } from "../controllers/closeRoom.controller.ts";
import { roomRepo, membershipRepo } from "../../shared/container.ts";

const service = new CloseRoomService(roomRepo, membershipRepo);
const controller = new CloseRoomController(service);

const router = Router();

// POST /close-room  (body: { code: "123456" })
router.post("/close-room", controller.handle);

export default router;
