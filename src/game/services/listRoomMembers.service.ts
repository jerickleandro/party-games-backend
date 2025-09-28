import type { ICreateRoomRepository } from "../repositories/createRoom.repository.ts";
import type { IJoinRoomRepository } from "../repositories/joinRoom.repository.ts";
import type { IRegisterUserRepository } from "../repositories/registerUser.repository.ts";

export class ListRoomMembersService {
    constructor(
        private readonly rooms: ICreateRoomRepository,
        private readonly memberships: IJoinRoomRepository,
        private readonly users: IRegisterUserRepository
    ) { }

    async execute(codeRaw: unknown) {
        const code = this.validateCode(codeRaw);

        const room = await this.rooms.findByCode(code);
        if (!room) throw Object.assign(new Error("sala não encontrada"), { status: 404 });

        const memberships = await this.memberships.listMembers(room.id);

        const members = await Promise.all(
            memberships.map(async (m) => {
                const u = await this.users.findById(m.userId);
                return {
                    userId: m.userId,
                    nickname: u?.nickname ?? null,
                    joinedAt: m.joinedAt,
                };
            })
        );

        return {
            roomId: room.id,
            code: room.code,
            members,
        };
    }

    private validateCode(code: unknown): string {
        if (typeof code !== "string" || !/^\d{6}$/.test(code)) {
            throw Object.assign(new Error("code deve ser string com 6 dígitos"), { status: 400 });
        }
        return code;
    }
}
