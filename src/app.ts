import express from "express";
import routes from "./routes.ts";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());
app.use("/api", routes);

export default app;
