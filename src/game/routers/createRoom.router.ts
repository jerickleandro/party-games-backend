import { Router } from "express";
import { InMemoryCreateRoomRepository } from "../repositories/createRoom.repository.ts";
import { CreateRoomService } from "../services/createRoom.service.ts";
import { CreateRoomController } from "../controllers/createRoom.controller.ts";

const repo = new InMemoryCreateRoomRepository();
const service = new CreateRoomService(repo);
const controller = new CreateRoomController(service);

const router = Router();

// POST /create-room  (body opcional: { identification: string })
router.post("/create-room", controller.handle);

export default router;
