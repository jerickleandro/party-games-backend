import type { IRegisterUserRepository, RegisteredUser } from "../repositories/registerUser.repository.ts";

export class RegisterUserService {
    constructor(private readonly repo: IRegisterUserRepository) { }

    async execute(nicknameRaw: unknown): Promise<RegisteredUser> {
        if (typeof nicknameRaw !== "string") {
            throw Object.assign(new Error("nickname deve ser uma string"), { status: 400 });
        }

        const nickname = nicknameRaw.trim();
        if (!nickname) {
            throw Object.assign(new Error("nickname é obrigatório"), { status: 400 });
        }

        const exists = await this.repo.findByNickname(nickname);
        if (exists) {
            throw Object.assign(new Error("nickname já está em uso"), { status: 409 });
        }

        return this.repo.create(nickname);
    }
}
