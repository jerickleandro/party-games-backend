// src/routes.ts
import { Router } from "express";
import { authMiddleware } from "./middlewares/auth.middleware.ts";
import registerUserRouter from "./game/routers/registerUser.router.ts";
import createRoomRouter from "./game/routers/createRoom.router.ts";
import joinRoomRouter from "./game/routers/joinRoom.router.ts";
import listRoomMembersRouter from "./game/routers/listRoomMembers.router.ts";

const routes = Router();

// Rotas protegidas
routes.use("/game", authMiddleware, registerUserRouter);
routes.use("/game", authMiddleware, createRoomRouter);
routes.use("/game", authMiddleware, joinRoomRouter);
routes.use("/game", authMiddleware, listRoomMembersRouter);

// Pública
routes.get("/health", (_req, res) => res.json({ status: "ok" }));

export default routes;
