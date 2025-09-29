import type { IGameRepository } from "../repositories/game.repository.ts";

export class GetGameTutorialService {
    constructor(private readonly repo: IGameRepository) { }

    async execute(idRaw: unknown) {
        if (typeof idRaw !== "string" || !idRaw.trim()) {
            throw Object.assign(new Error("id inválido"), { status: 400 });
        }
        const game = await this.repo.getById(idRaw.trim());
        if (!game) throw Object.assign(new Error("jogo não encontrado"), { status: 404 });

        return {
            id: game.id,
            name: game.name,
            description: game.description,
            steps: game.tutorialSteps
        };
    }
}
