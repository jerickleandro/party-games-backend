import type { Request, Response } from "express";
import { LeaveRoomService } from "../services/leaveRoom.service.ts";

export class LeaveRoomController {
    constructor(private readonly service: LeaveRoomService) { }

    handle = async (req: Request, res: Response) => {
        try {
            const result = await this.service.execute({
                code: req.body?.code,
                userId: req.body?.userId
            });
            // 200 mesmo quando idempotente (left=false)
            res.status(200).json(result);
        } catch (err: any) {
            const status = Number(err?.status) || 500;
            res.status(status).json({ error: err?.message ?? "erro interno" });
        }
    };
}
