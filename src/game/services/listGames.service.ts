import type { IGameRepository } from "../repositories/game.repository.ts";

export class ListGamesService {
    constructor(private readonly repo: IGameRepository) { }

    async execute() {
        const games = await this.repo.list();
        // catálogo: somente id, name, photoUrl, shortDescription
        return games.map(g => ({
            id: g.id,
            name: g.name,
            photoUrl: g.photoUrl,
            shortDescription: g.shortDescription
        }));
    }
}
