import { Router } from "express";
import { ListRoomMembersService } from "../services/listRoomMembers.service.ts";
import { ListRoomMembersController } from "../controllers/listRoomMembers.controller.ts";
import { roomRepo, membershipRepo, userRepo } from "../../shared/container.ts";

const service = new ListRoomMembersService(roomRepo, membershipRepo, userRepo);
const controller = new ListRoomMembersController(service);

const router = Router();

// GET /rooms/:code/members
router.get("/rooms/:code/members", controller.handle);

export default router;
