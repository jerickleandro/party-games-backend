// src/game/routers/registerUser.router.ts
import { Router } from "express";
import { RegisterUserService } from "../services/registerUser.service.ts";
import { RegisterUserController } from "../controllers/registerUser.controller.ts";
import { userRepo } from "../../shared/container.ts";

const service = new RegisterUserService(userRepo);
const controller = new RegisterUserController(service);

const router = Router();
router.post("/register-user", controller.handle);

export default router;
