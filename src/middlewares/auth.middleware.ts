import type { Request, Response, NextFunction } from "express";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.header("authorization");

  // esperado: Authorization: Bearer <token>
  const expectedToken = process.env.APP_TOKEN;

  if (!expectedToken) {
    console.error("APP_TOKEN não configurado no .env");
    return res.status(500).json({ error: "configuração inválida" });
  }

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ error: "token ausente ou inválido" });
  }

  const providedToken = token.replace("Bearer ", "").trim();

  if (providedToken !== expectedToken) {
    return res.status(403).json({ error: "token não autorizado" });
  }

  next();
}
