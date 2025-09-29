import { Router } from "express";
import { GetGameTutorialService } from "../services/getGameTutorial.service.ts";
import { GetGameTutorialController } from "../controllers/getGameTutorial.controller.ts";
import { gameRepo } from "../../shared/container.ts";

const service = new GetGameTutorialService(gameRepo);
const controller = new GetGameTutorialController(service);

const router = Router();

// GET /games/:id/tutorial
router.get("/games/:id/tutorial", controller.handle);

export default router;
