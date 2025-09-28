// src/game/repositories/registerUser.repository.ts
import { randomUUID } from "node:crypto";

export interface RegisteredUser {
    id: string;
    nickname: string;
    createdAt: Date;
}

export interface IRegisterUserRepository {
    create(nickname: string): Promise<RegisteredUser>;
    findByNickname(nickname: string): Promise<RegisteredUser | null>;
    findById(id: string): Promise<RegisteredUser | null>;
}

export class InMemoryRegisterUserRepository implements IRegisterUserRepository {
    private usersById = new Map<string, RegisteredUser>();
    private usersByNickname = new Map<string, string>(); // nicknameLower -> userId

    async create(nickname: string): Promise<RegisteredUser> {
        const id = randomUUID();
        const user: RegisteredUser = { id, nickname, createdAt: new Date() };
        this.usersById.set(id, user);
        this.usersByNickname.set(nickname.toLowerCase(), id);
        return user;
    }

    async findByNickname(nickname: string): Promise<RegisteredUser | null> {
        const id = this.usersByNickname.get(nickname.toLowerCase());
        return id ? this.usersById.get(id) ?? null : null;
    }

    async findById(id: string): Promise<RegisteredUser | null> {
        return this.usersById.get(id) ?? null;
    }
}
