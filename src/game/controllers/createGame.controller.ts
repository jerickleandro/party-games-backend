import type { Request, Response } from "express";
import { CreateGameService } from "../services/createGame.service.ts";

export class CreateGameController {
    constructor(private readonly service: CreateGameService) { }

    handle = async (req: Request, res: Response) => {
        try {
            const game = await this.service.execute(req.body);
            res.status(201)
                .location(`/api/game/games/${game.id}`)
                .json(game);
        } catch (err: any) {
            res.status(Number(err?.status) || 500).json({ error: err?.message ?? "erro interno" });
        }
    };
}
