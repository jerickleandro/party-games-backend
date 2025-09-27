// src/game/services/joinRoom.service.ts
import type { IRegisterUserRepository } from "../repositories/registerUser.repository.ts";
import type { ICreateRoomRepository } from "../repositories/createRoom.repository.ts";
import type { IJoinRoomRepository, RoomMembership } from "../repositories/joinRoom.repository.ts";

export class JoinRoomService {
    constructor(
        private readonly users: IRegisterUserRepository,
        private readonly rooms: ICreateRoomRepository,
        private readonly memberships: IJoinRoomRepository
    ) { }

    async execute(params: { code: unknown; userId: unknown }): Promise<RoomMembership & { code: string }> {
        const code = this.validateCode(params.code);
        const userId = this.validateUserId(params.userId);

        const user = await this.users.findById(userId);
        if (!user) throw Object.assign(new Error("usuário não encontrado"), { status: 404 });

        const room = await this.rooms.findByCode(code);
        if (!room) throw Object.assign(new Error("sala não encontrada"), { status: 404 });

        const currentRoomId = await this.memberships.getRoomIdForUser(userId);
        if (currentRoomId && currentRoomId !== room.id) {
            throw Object.assign(new Error("usuário já está em outra sala"), { status: 409 });
        }

        const membership = await this.memberships.addMember(room.id, user.id);
        return { ...membership, code: room.code };
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
