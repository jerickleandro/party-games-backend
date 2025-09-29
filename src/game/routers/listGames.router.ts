import { Router } from "express";
import { ListGamesService } from "../services/listGames.service.ts";
import { ListGamesController } from "../controllers/listGames.controller.ts";
import { gameRepo } from "../../shared/container.ts";

const service = new ListGamesService(gameRepo);
const controller = new ListGamesController(service);

const router = Router();

// GET /games
router.get("/games", controller.handle);

export default router;
