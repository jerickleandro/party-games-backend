// src/game/routers/joinRoom.router.ts
import { Router } from "express";
import { JoinRoomService } from "../services/joinRoom.service.ts";
import { JoinRoomController } from "../controllers/joinRoom.controller.ts";
import { userRepo, roomRepo, membershipRepo } from "../../shared/container.ts";

const service = new JoinRoomService(userRepo, roomRepo, membershipRepo);
const controller = new JoinRoomController(service);

const router = Router();

// POST /join-room  (body: { code: "123456", userId: "<uuid>" })
router.post("/join-room", controller.handle);

export default router;
