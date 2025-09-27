import { Router } from "express";
import { authMiddleware } from "./middlewares/auth.middleware.ts";
import registerUserRouter from "./game/routers/registerUser.router.ts";
import createRoomRouter from "./game/routers/createRoom.router.ts";

const routes = Router();

routes.use("/game", authMiddleware, registerUserRouter);
routes.use("/game", authMiddleware, createRoomRouter);

routes.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default routes;
