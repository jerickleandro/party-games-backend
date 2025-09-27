import { Router } from "express";
import { InMemoryRegisterUserRepository } from "../repositories/registerUser.repository.ts";
import { RegisterUserService } from "../services/registerUser.service.ts";
import { RegisterUserController } from "../controllers/registerUser.controller.ts";

const repo = new InMemoryRegisterUserRepository();
const service = new RegisterUserService(repo);
const controller = new RegisterUserController(service);

const router = Router();

// POST /register-user
router.post("/register-user", controller.handle);

export default router;
