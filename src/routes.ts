// src/routes.ts
import { Router } from "express";
import { authMiddleware } from "./middlewares/auth.middleware.ts";
import registerUserRouter from "./game/routers/registerUser.router.ts";
import createRoomRouter from "./game/routers/createRoom.router.ts";
import joinRoomRouter from "./game/routers/joinRoom.router.ts";
import listRoomMembersRouter from "./game/routers/listRoomMembers.router.ts";
import leaveRoomRouter from "./game/routers/leaveRoom.router.ts";
import closeRoomRouter from "./game/routers/closeRoom.router.ts";

const routes = Router();

// Rotas protegidas
routes.use("/game", authMiddleware, registerUserRouter);
routes.use("/game", authMiddleware, createRoomRouter);
routes.use("/game", authMiddleware, joinRoomRouter);
routes.use("/game", authMiddleware, listRoomMembersRouter);
routes.use("/game", authMiddleware, leaveRoomRouter);
routes.use("/game", authMiddleware, closeRoomRouter);

// Pública
routes.get("/health", (_req, res) => res.json({ status: "ok" }));

export default routes;
