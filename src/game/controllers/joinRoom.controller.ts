// src/game/controllers/joinRoom.controller.ts
import type { Request, Response } from "express";
import { JoinRoomService } from "../services/joinRoom.service.ts";

export class JoinRoomController {
    constructor(private readonly service: JoinRoomService) { }

    handle = async (req: Request, res: Response) => {
        try {
            const result = await this.service.execute({
                code: req.body?.code,
                userId: req.body?.userId
            });

            res.status(200).json({
                roomId: result.roomId,
                code: result.code,
                userId: result.userId,
                joinedAt: result.joinedAt
            });
        } catch (err: any) {
            const status = Number(err?.status) || 500;
            res.status(status).json({ error: err?.message ?? "erro interno" });
        }
    };
}
