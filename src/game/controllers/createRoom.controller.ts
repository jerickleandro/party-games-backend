import type { Request, Response } from "express";
import { CreateRoomService } from "../services/createRoom.service.ts";

export class CreateRoomController {
    constructor(private readonly service: CreateRoomService) { }

    handle = async (req: Request, res: Response) => {
        try {
            const room = await this.service.execute(req.body?.identification);
            res
                .status(201)
                .location(`/api/game/rooms/${room.id}`)
                .json({
                    id: room.id,
                    code: room.code,
                    createdAt: room.createdAt,
                    identification: room.identification ?? null,
                });
        } catch (err: any) {
            const status = Number(err?.status) || 500;
            res.status(status).json({ error: err?.message ?? "erro interno" });
        }
    };
}
