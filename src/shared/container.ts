// src/shared/container.ts
import { InMemoryRegisterUserRepository } from "../game/repositories/registerUser.repository.ts";
import { InMemoryCreateRoomRepository } from "../game/repositories/createRoom.repository.ts";
import { InMemoryJoinRoomRepository } from "../game/repositories/joinRoom.repository.ts";

export const userRepo = new InMemoryRegisterUserRepository();
export const roomRepo = new InMemoryCreateRoomRepository();
export const membershipRepo = new InMemoryJoinRoomRepository();
