export interface RoomMembership {
  roomId: string;
  userId: string;
  joinedAt: Date;
}

export interface IJoinRoomRepository {
  addMember(roomId: string, userId: string): Promise<RoomMembership>; // idempotente
  isMember(roomId: string, userId: string): Promise<boolean>;
  listMembers(roomId: string): Promise<RoomMembership[]>;
  getRoomIdForUser(userId: string): Promise<string | null>; // NOVO
}

export class InMemoryJoinRoomRepository implements IJoinRoomRepository {
  private membersByRoom = new Map<string, Map<string, RoomMembership>>(); // roomId -> (userId -> membership)
  private roomByUser = new Map<string, string>(); // userId -> roomId (para garantir uma sala por usuário)

  async addMember(roomId: string, userId: string): Promise<RoomMembership> {
    let roomMap = this.membersByRoom.get(roomId);
    if (!roomMap) {
      roomMap = new Map<string, RoomMembership>();
      this.membersByRoom.set(roomId, roomMap);
    }
    const existing = roomMap.get(userId);
    if (existing) return existing;

    const membership: RoomMembership = { roomId, userId, joinedAt: new Date() };
    roomMap.set(userId, membership);
    this.roomByUser.set(userId, roomId);
    return membership;
  }

  async isMember(roomId: string, userId: string): Promise<boolean> {
    return this.membersByRoom.get(roomId)?.has(userId) ?? false;
  }

  async listMembers(roomId: string): Promise<RoomMembership[]> {
    const roomMap = this.membersByRoom.get(roomId);
    return roomMap ? Array.from(roomMap.values()) : [];
  }

  async getRoomIdForUser(userId: string): Promise<string | null> {
    return this.roomByUser.get(userId) ?? null;
  }
}
