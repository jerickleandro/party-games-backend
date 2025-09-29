import { randomUUID } from "node:crypto";

export interface Game {
    id: string;
    name: string;
    photoUrl: string;
    shortDescription: string;
    description: string;
    tutorialSteps: string[];
    createdAt: Date;
    updatedAt: Date;
}

export type CreateGameInput = {
    name: string;
    photoUrl: string;
    shortDescription: string;
    description: string;
    tutorialSteps: string[];
};

export type UpdateGameInput = Partial<CreateGameInput>;

export interface IGameRepository {
    create(data: CreateGameInput): Promise<Game>;
    list(): Promise<Game[]>;
    getById(id: string): Promise<Game | null>;
    update(id: string, data: UpdateGameInput): Promise<Game | null>;
    delete(id: string): Promise<boolean>;
}

export class InMemoryGameRepository implements IGameRepository {
    private games = new Map<string, Game>();

    async create(data: CreateGameInput): Promise<Game> {
        const now = new Date();
        const game: Game = {
            id: randomUUID(),
            name: data.name,
            photoUrl: data.photoUrl,
            shortDescription: data.shortDescription,
            description: data.description,
            tutorialSteps: [...data.tutorialSteps],
            createdAt: now,
            updatedAt: now,
        };
        this.games.set(game.id, game);
        return game;
    }

    async list(): Promise<Game[]> {
        // retorno ordenado por createdAt desc
        return Array.from(this.games.values())
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    async getById(id: string): Promise<Game | null> {
        return this.games.get(id) ?? null;
    }

    async update(id: string, data: UpdateGameInput): Promise<Game | null> {
        const current = this.games.get(id);
        if (!current) return null;

        const updated: Game = {
            ...current,
            ...data,
            tutorialSteps: data.tutorialSteps ? [...data.tutorialSteps] : current.tutorialSteps,
            updatedAt: new Date(),
        };
        this.games.set(id, updated);
        return updated;
    }

    async delete(id: string): Promise<boolean> {
        return this.games.delete(id);
    }
}
