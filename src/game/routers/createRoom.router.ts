// src/game/routers/createRoom.router.ts
import { Router } from "express";
import { CreateRoomService } from "../services/createRoom.service.ts";
import { CreateRoomController } from "../controllers/createRoom.controller.ts";
import { roomRepo } from "../../shared/container.ts";

const service = new CreateRoomService(roomRepo);
const controller = new CreateRoomController(service);

const router = Router();
router.post("/create-room", controller.handle);

export default router;
