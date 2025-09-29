import type { IGameRepository } from "../repositories/game.repository.ts";

export class DeleteGameService {
    constructor(private readonly repo: IGameRepository) { }

    async execute(idRaw: unknown) {
        if (typeof idRaw !== "string" || !idRaw.trim()) {
            throw Object.assign(new Error("id inválido"), { status: 400 });
        }
        const ok = await this.repo.delete(idRaw.trim());
        if (!ok) throw Object.assign(new Error("jogo não encontrado"), { status: 404 });
        return { deleted: true };
    }
}
