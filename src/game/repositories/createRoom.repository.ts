// src/game/repositories/createRoom.repository.ts
import { randomUUID } from "node:crypto";

export interface Room {
    id: string;
    code: string; // 6 dígitos
    createdAt: Date;
    identification?: string | null;
}

export interface ICreateRoomRepository {
    create(data: { code: string; identification?: string | null }): Promise<Room>;
    existsByCode(code: string): Promise<boolean>;
    findByCode(code: string): Promise<Room | null>;
}

export class InMemoryCreateRoomRepository implements ICreateRoomRepository {
    private roomsById = new Map<string, Room>();
    private codeToRoomId = new Map<string, string>();

    async create(data: { code: string; identification?: string | null }): Promise<Room> {
        const id = randomUUID();
        const room: Room = {
            id,
            code: data.code,
            createdAt: new Date(),
            identification: data.identification ?? null,
        };
        this.roomsById.set(id, room);
        this.codeToRoomId.set(room.code, id);
        return room;
    }

    async existsByCode(code: string): Promise<boolean> {
        return this.codeToRoomId.has(code);
    }

    async findByCode(code: string): Promise<Room | null> {
        const id = this.codeToRoomId.get(code);
        return id ? this.roomsById.get(id) ?? null : null;
    }
}
