import { Router } from "express";
import { UpdateGameService } from "../services/updateGame.service.ts";
import { UpdateGameController } from "../controllers/updateGame.controller.ts";
import { gameRepo } from "../../shared/container.ts";

const service = new UpdateGameService(gameRepo);
const controller = new UpdateGameController(service);

const router = Router();

// PATCH /games/:id
router.patch("/games/:id", controller.handle);

export default router;