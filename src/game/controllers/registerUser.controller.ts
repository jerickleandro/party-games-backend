import type { Request, Response } from "express";
import { RegisterUserService } from "../services/registerUser.service.ts";

export class RegisterUserController {
    constructor(private readonly service: RegisterUserService) { }

    handle = async (req: Request, res: Response) => {
        try {
            const user = await this.service.execute(req.body?.nickname);
            res.status(201)
                .location(`/api/game/users/${user.id}`)
                .json({ id: user.id, nickname: user.nickname, createdAt: user.createdAt });
        } catch (err: any) {
            const status = Number(err?.status) || 500;
            res.status(status).json({ error: err?.message ?? "erro interno" });
        }
    };
}
