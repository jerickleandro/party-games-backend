import request from "supertest";
import app from "../../src/app.ts";

describe("Create Game (integration)", () => {
    const APP_TOKEN = process.env.APP_TOKEN || "test-token";
    beforeAll(() => (process.env.APP_TOKEN = APP_TOKEN));

    it("deve criar um jogo completo e retornar 201", async () => {
        const payload = {
            name: `Adedonha Maluca ${Date.now()}`,
            photoUrl: "https://example.com/adedonha.jpg",
            shortDescription: "Partida rápida com temas e letras aleatórias.",
            description: "Versão maluca do clássico stop.",
            tutorialSteps: [
                "Após iniciar o jogo será sorteado um tema e uma letra",
                "Na etapa da defesa todos deverão colocar suas sugestões"
            ]
        };

        const res = await request(app)
            .post("/api/game/games")
            .set("Authorization", `Bearer ${APP_TOKEN}`)
            .send(payload);

        expect(res.status).toBe(201);
        expect(res.headers.location).toMatch(/\/api\/game\/games\/.+/);
        expect(res.body).toMatchObject({
            name: payload.name,
            photoUrl: payload.photoUrl,
            shortDescription: payload.shortDescription,
            description: payload.description
        });
        expect(Array.isArray(res.body.tutorialSteps)).toBe(true);
        expect(typeof res.body.id).toBe("string");
        expect(new Date(res.body.createdAt).toString()).not.toBe("Invalid Date");
        expect(new Date(res.body.updatedAt).toString()).not.toBe("Invalid Date");
        expect(res.body.createdAt).toBe(res.body.updatedAt);
    });

    it("deve falhar com 400 quando campos obrigatórios estiverem ausentes/invalidos", async () => {
        const bad = {
            name: "Sem Foto",
            // photoUrl ausente
            shortDescription: "",
            description: 123,
            tutorialSteps: ["", 1, null]
        };

        const res = await request(app)
            .post("/api/game/games")
            .set("Authorization", `Bearer ${APP_TOKEN}`)
            .send(bad as any);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error");
    });
});
