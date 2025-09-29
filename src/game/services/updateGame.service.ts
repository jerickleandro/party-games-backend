import type { IGameRepository, UpdateGameInput, Game } from "../repositories/game.repository.ts";

export class UpdateGameService {
    constructor(private readonly repo: IGameRepository) { }

    async execute(idRaw: unknown, raw: any): Promise<Game> {
        const id = this.validateId(idRaw);
        const data = this.validatePartial(raw);

        const updated = await this.repo.update(id, data);
        if (!updated) throw Object.assign(new Error("jogo não encontrado"), { status: 404 });
        return updated;
    }

    private validateId(idRaw: unknown): string {
        if (typeof idRaw !== "string" || !idRaw.trim()) {
            throw Object.assign(new Error("id inválido"), { status: 400 });
        }
        return idRaw.trim();
    }

    private validatePartial(i: any): UpdateGameInput {
        if (!i || typeof i !== "object") {
            throw Object.assign(new Error("payload inválido"), { status: 400 });
        }
        const out: UpdateGameInput = {};
        if (i.name !== undefined) {
            if (!isNonEmptyStr(i.name)) throw err("name inválido");
            out.name = i.name.trim();
        }
        if (i.photoUrl !== undefined) {
            if (!isNonEmptyStr(i.photoUrl)) throw err("photoUrl inválido");
            out.photoUrl = i.photoUrl.trim();
        }
        if (i.shortDescription !== undefined) {
            if (!isNonEmptyStr(i.shortDescription)) throw err("shortDescription inválido");
            out.shortDescription = i.shortDescription.trim();
        }
        if (i.description !== undefined) {
            if (!isNonEmptyStr(i.description)) throw err("description inválido");
            out.description = i.description.trim();
        }
        if (i.tutorialSteps !== undefined) {
            if (!Array.isArray(i.tutorialSteps) || i.tutorialSteps.some((s: any) => !isNonEmptyStr(s))) {
                throw err("tutorialSteps deve ser array de strings não vazias");
            }
            out.tutorialSteps = i.tutorialSteps.map((s: string) => s.trim());
        }
        return out;
    }
}

function isNonEmptyStr(v: any): v is string { return typeof v === "string" && v.trim().length > 0; }
function err(m: string, status = 400) { return Object.assign(new Error(m), { status }); }
