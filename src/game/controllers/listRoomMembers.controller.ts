import type { Request, Response } from "express";
import { ListRoomMembersService } from "../services/listRoomMembers.service.ts";

export class ListRoomMembersController {
    constructor(private readonly service: ListRoomMembersService) { }

    handle = async (req: Request, res: Response) => {
        try {
            const { code } = req.params;
            const result = await this.service.execute(code);
            res.status(200).json(result);
        } catch (err: any) {
            const status = Number(err?.status) || 500;
            res.status(status).json({ error: err?.message ?? "erro interno" });
        }
    };
}
