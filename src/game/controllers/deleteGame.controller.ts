import type { Request, Response } from "express";
import { DeleteGameService } from "../services/deleteGame.service.ts";

export class DeleteGameController {
    constructor(private readonly service: DeleteGameService) { }

    handle = async (req: Request, res: Response) => {
        try {
            const result = await this.service.execute(req.params.id);
            res.status(200).json(result);
        } catch (err: any) {
            res.status(Number(err?.status) || 500).json({ error: err?.message ?? "erro interno" });
        }
    };
}
