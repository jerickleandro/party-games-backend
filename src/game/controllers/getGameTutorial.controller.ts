import type { Request, Response } from "express";
import { GetGameTutorialService } from "../services/getGameTutorial.service.ts";

export class GetGameTutorialController {
    constructor(private readonly service: GetGameTutorialService) { }

    handle = async (req: Request, res: Response) => {
        try {
            const result = await this.service.execute(req.params.id);
            res.status(200).json(result);
        } catch (err: any) {
            res.status(Number(err?.status) || 500).json({ error: err?.message ?? "erro interno" });
        }
    };
}
