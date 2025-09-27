import { randomUUID } from "node:crypto";

export interface RegisteredUser {
    id: string;
    nickname: string;
    createdAt: Date;
}

export interface IRegisterUserRepository {
    create(nickname: string): Promise<RegisteredUser>;
    findByNickname(nickname: string): Promise<RegisteredUser | null>;
}

export class InMemoryRegisterUserRepository implements IRegisterUserRepository {
    private usersByNickname = new Map<string, RegisteredUser>();

    async create(nickname: string): Promise<RegisteredUser> {
        const id = randomUUID();
        const user: RegisteredUser = { id, nickname, createdAt: new Date() };
        this.usersByNickname.set(nickname.toLowerCase(), user);
        return user;
    }

    async findByNickname(nickname: string): Promise<RegisteredUser | null> {
        return this.usersByNickname.get(nickname.toLowerCase()) ?? null;
    }
}
