import { Router } from "express";
import { DeleteGameService } from "../services/deleteGame.service.ts";
import { DeleteGameController } from "../controllers/deleteGame.controller.ts";
import { gameRepo } from "../../shared/container.ts";

const service = new DeleteGameService(gameRepo);
const controller = new DeleteGameController(service);

const router = Router();

// DELETE /games/:id
router.delete("/games/:id", controller.handle);

export default router;