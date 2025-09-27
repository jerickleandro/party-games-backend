import { Router } from "express";
import registerUserRouter from "./game/routers/registerUser.router.ts";

const routes = Router();

routes.use("/game", registerUserRouter);

routes.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default routes;
