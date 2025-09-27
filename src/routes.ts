import { Router } from "express";
import registerUserRouter from "./game/routers/registerUser.router.ts";
import { authMiddleware } from "./middlewares/auth.middleware.ts";

const routes = Router();

routes.use("/game", authMiddleware, registerUserRouter);

routes.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default routes;
