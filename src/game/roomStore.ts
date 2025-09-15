import { Room } from '../types';


const rooms = new Map<string, Room>();


export const RoomStore = {
    all: rooms,
    create(room: Room) { rooms.set(room.code, room); },
    get(code: string) { return rooms.get(code); },
    delete(code: string) { rooms.delete(code); },
};