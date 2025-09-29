import type { Request, Response } from "express";
import { ListGamesService } from "../services/listGames.service.ts";

export class ListGamesController {
    constructor(private readonly service: ListGamesService) { }

    handle = async (_req: Request, res: Response) => {
        try {
            const games = await this.service.execute();
            res.status(200).json(games);
        } catch (err: any) {
            res.status(Number(err?.status) || 500).json({ error: err?.message ?? "erro interno" });
        }
    };
}
