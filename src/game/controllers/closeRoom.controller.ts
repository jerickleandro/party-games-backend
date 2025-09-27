import type { Request, Response } from "express";
import { CloseRoomService } from "../services/closeRoom.service.ts";

export class CloseRoomController {
    constructor(private readonly service: CloseRoomService) { }

    handle = async (req: Request, res: Response) => {
        try {
            const result = await this.service.execute(req.body?.code);
            res.status(200).json(result);
        } catch (err: any) {
            const status = Number(err?.status) || 500;
            res.status(status).json({ error: err?.message ?? "erro interno" });
        }
    };
}
