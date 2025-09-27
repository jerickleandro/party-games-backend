export interface Room {
    id: string;
    code: string;
    createdAt: Date;
    identification?: string | null;
}

export interface ICreateRoomRepository {
    create(data: { code: string; identification?: string | null }): Promise<Room>;
    existsByCode(code: string): Promise<boolean>;
}

export class InMemoryCreateRoomRepository implements ICreateRoomRepository {
    private roomsById = new Map<string, Room>();
    private codes = new Set<string>();

    async create(data: { code: string; identification?: string | null }): Promise<Room> {
        const id = crypto.randomUUID();
        const room: Room = {
            id,
            code: data.code,
            createdAt: new Date(),
            identification: data.identification ?? null,
        };
        this.roomsById.set(id, room);
        this.codes.add(room.code);
        return room;
    }

    async existsByCode(code: string): Promise<boolean> {
        return this.codes.has(code);
    }
}
