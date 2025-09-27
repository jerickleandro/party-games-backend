import express from "express";
import dotenv from "dotenv";
import routes from "./routes.ts";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // fallback se não tiver PORT

// Middleware para JSON
app.use(express.json());
app.use("/api", routes);

// rota de teste
app.get("/", (req, res) => {
  res.send("🚀 API do jogo está no ar!");
});

// inicia o servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
