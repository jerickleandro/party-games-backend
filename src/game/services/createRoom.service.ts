import type { ICreateRoomRepository, Room } from "../repositories/createRoom.repository.ts";
import crypto from "node:crypto";

export class CreateRoomService {
    constructor(private readonly repo: ICreateRoomRepository) { }

    async execute(identificationRaw?: unknown): Promise<Room> {
        let identification: string | undefined;
        if (typeof identificationRaw !== "undefined") {
            if (typeof identificationRaw !== "string") {
                throw Object.assign(new Error("identification deve ser string"), { status: 400 });
            }
            const trimmed = identificationRaw.trim();
            if (trimmed.length > 0) identification = trimmed;
        }

        const code = await this.generateUniqueCode();

        return this.repo.create({ code, identification });
    }

    private async generateUniqueCode(): Promise<string> {
        for (let i = 0; i < 5000; i++) {
            const n = crypto.randomInt(0, 1_000_000);
            const code = String(n).padStart(6, "0");
            if (!(await this.repo.existsByCode(code))) {
                return code;
            }
        }
        throw Object.assign(new Error("não foi possível gerar código da sala"), { status: 500 });
    }
}
