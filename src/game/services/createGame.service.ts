import type { IGameRepository, CreateGameInput, Game } from "../repositories/game.repository.ts";

export class CreateGameService {
    constructor(private readonly repo: IGameRepository) { }

    async execute(raw: any): Promise<Game> {
        const data = this.validate(raw);
        return this.repo.create(data);
    }

    private validate(i: any): CreateGameInput {
        const err = (m: string, status = 400) => Object.assign(new Error(m), { status });
        if (!i || typeof i !== "object") throw err("payload inválido");
        const { name, photoUrl, shortDescription, description, tutorialSteps } = i;

        if (!isNonEmptyStr(name)) throw err("name é obrigatório");
        if (!isNonEmptyStr(photoUrl)) throw err("photoUrl é obrigatório");
        if (!isNonEmptyStr(shortDescription)) throw err("shortDescription é obrigatório");
        if (!isNonEmptyStr(description)) throw err("description é obrigatório");
        if (!Array.isArray(tutorialSteps) || tutorialSteps.some(s => !isNonEmptyStr(s))) {
            throw err("tutorialSteps deve ser array de strings não vazias");
        }
        return { name: name.trim(), photoUrl: photoUrl.trim(), shortDescription: shortDescription.trim(), description: description.trim(), tutorialSteps: tutorialSteps.map((s: string) => s.trim()) };
    }
}

function isNonEmptyStr(v: any): v is string {
    return typeof v === "string" && v.trim().length > 0;
}
