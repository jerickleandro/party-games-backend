import type { ICreateRoomRepository } from "../repositories/createRoom.repository.ts";
import type { IJoinRoomRepository } from "../repositories/joinRoom.repository.ts";

export class LeaveRoomService {
    constructor(
        private readonly rooms: ICreateRoomRepository,
        private readonly memberships: IJoinRoomRepository
    ) { }

    async execute(params: { code: unknown; userId: unknown }) {
        const code = this.validateCode(params.code);
        const userId = this.validateUserId(params.userId);

        const room = await this.rooms.findByCode(code);
        if (!room) throw Object.assign(new Error("sala não encontrada"), { status: 404 });

        const removed = await this.memberships.removeMember(room.id, userId);
        // idempotente: se não era membro, apenas indica no retorno
        return { roomId: room.id, code: room.code, userId, left: removed };
    }

    private validateCode(code: unknown): string {
        if (typeof code !== "string" || !/^\d{6}$/.test(code)) {
            throw Object.assign(new Error("code deve ser string com 6 dígitos"), { status: 400 });
        }
        return code;
    }

    private validateUserId(userId: unknown): string {
        if (typeof userId !== "string" || userId.trim() === "") {
            throw Object.assign(new Error("userId é obrigatório"), { status: 400 });
        }
        return userId;
    }
}
