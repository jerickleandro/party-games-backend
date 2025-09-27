import type { ICreateRoomRepository } from "../repositories/createRoom.repository.ts";
import type { IJoinRoomRepository } from "../repositories/joinRoom.repository.ts";

export class CloseRoomService {
    constructor(
        private readonly rooms: ICreateRoomRepository,
        private readonly memberships: IJoinRoomRepository
    ) { }

    async execute(codeRaw: unknown) {
        const code = this.validateCode(codeRaw);

        const room = await this.rooms.findByCode(code);
        if (!room) throw Object.assign(new Error("sala não encontrada"), { status: 404 });

        const removedCount = await this.memberships.clearRoom(room.id);
        return { roomId: room.id, code: room.code, removedCount };
    }

    private validateCode(code: unknown): string {
        if (typeof code !== "string" || !/^\d{6}$/.test(code)) {
            throw Object.assign(new Error("code deve ser string com 6 dígitos"), { status: 400 });
        }
        return code;
    }
}
