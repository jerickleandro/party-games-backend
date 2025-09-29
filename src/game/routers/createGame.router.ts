import { Router } from "express";
import { CreateGameService } from "../services/createGame.service.ts";
import { CreateGameController } from "../controllers/createGame.controller.ts";
import { gameRepo } from "../../shared/container.ts";

const service = new CreateGameService(gameRepo);
const controller = new CreateGameController(service);

const router = Router();

// POST /games
router.post("/games", controller.handle);

export default router;
