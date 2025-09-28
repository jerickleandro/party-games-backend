export interface RoomMembership {
  roomId: string;
  userId: string;
  joinedAt: Date;
}

export interface IJoinRoomRepository {
  addMember(roomId: string, userId: string): Promise<RoomMembership>;
  isMember(roomId: string, userId: string): Promise<boolean>;
  listMembers(roomId: string): Promise<RoomMembership[]>;
  getRoomIdForUser(userId: string): Promise<string | null>;
  removeMember(roomId: string, userId: string): Promise<boolean>;
  clearRoom(roomId: string): Promise<number>;
}

export class InMemoryJoinRoomRepository implements IJoinRoomRepository {
  private membersByRoom = new Map<string, Map<string, RoomMembership>>();
  private roomByUser = new Map<string, string>();

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

  async removeMember(roomId: string, userId: string): Promise<boolean> {
    const roomMap = this.membersByRoom.get(roomId);
    if (!roomMap) return false;
    const existed = roomMap.delete(userId);
    if (existed) {
      // se o índice reverso apontava para esta sala, remova-o
      if (this.roomByUser.get(userId) === roomId) this.roomByUser.delete(userId);
      if (roomMap.size === 0) this.membersByRoom.delete(roomId);
    }
    return existed;
  }

  async clearRoom(roomId: string): Promise<number> {
    const roomMap = this.membersByRoom.get(roomId);
    if (!roomMap) return 0;
    // limpar índice reverso
    for (const userId of roomMap.keys()) {
      if (this.roomByUser.get(userId) === roomId) this.roomByUser.delete(userId);
    }
    const removed = roomMap.size;
    this.membersByRoom.delete(roomId);
    return removed;
  }
}
