import type { Request, Response } from "express";
import { UpdateGameService } from "../services/updateGame.service.ts";

export class UpdateGameController {
    constructor(private readonly service: UpdateGameService) { }

    handle = async (req: Request, res: Response) => {
        try {
            const game = await this.service.execute(req.params.id, req.body);
            res.status(200).json(game);
        } catch (err: any) {
            res.status(Number(err?.status) || 500).json({ error: err?.message ?? "erro interno" });
        }
    };
}
