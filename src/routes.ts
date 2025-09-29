// src/routes.ts
import { Router } from "express";
import { authMiddleware } from "./middlewares/auth.middleware.ts";
import registerUserRouter from "./game/routers/registerUser.router.ts";
import createRoomRouter from "./game/routers/createRoom.router.ts";
import joinRoomRouter from "./game/routers/joinRoom.router.ts";
import listRoomMembersRouter from "./game/routers/listRoomMembers.router.ts";
import leaveRoomRouter from "./game/routers/leaveRoom.router.ts";
import closeRoomRouter from "./game/routers/closeRoom.router.ts";
import createGameRouter from "./game/routers/createGame.router.ts";
import listGamesRouter from "./game/routers/listGames.router.ts";
import getGameTutorialRouter from "./game/routers/getGameTutorial.router.ts";
import updateGameRouter from "./game/routers/updateGame.router.ts";
import deleteGameRouter from "./game/routers/deleteGame.router.ts";

const routes = Router();

// Rotas protegidas
routes.use("/game", authMiddleware, registerUserRouter);
routes.use("/game", authMiddleware, createRoomRouter);
routes.use("/game", authMiddleware, joinRoomRouter);
routes.use("/game", authMiddleware, listRoomMembersRouter);
routes.use("/game", authMiddleware, leaveRoomRouter);
routes.use("/game", authMiddleware, closeRoomRouter);
routes.use("/game", authMiddleware, createGameRouter);
routes.use("/game", authMiddleware, listGamesRouter);
routes.use("/game", authMiddleware, getGameTutorialRouter);
routes.use("/game", authMiddleware, updateGameRouter);
routes.use("/game", authMiddleware, deleteGameRouter);

// Pública
routes.get("/health", (_req, res) => res.json({ status: "ok" }));

export default routes;
