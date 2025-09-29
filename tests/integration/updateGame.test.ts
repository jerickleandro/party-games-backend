import request from "supertest";
import app from "../../src/app.ts";

describe("Update Game (integration)", () => {
    const APP_TOKEN = process.env.APP_TOKEN || "test-token";
    beforeAll(() => (process.env.APP_TOKEN = APP_TOKEN));

    async function createGame() {
        const payload = {
            name: `Updatable ${Date.now()}`,
            photoUrl: "https://example.com/updatable.jpg",
            shortDescription: "Antes",
            description: "Descrição original",
            tutorialSteps: ["P1", "P2"]
        };
        const res = await request(app)
            .post("/api/game/games")
            .set("Authorization", `Bearer ${APP_TOKEN}`)
            .send(payload);
        expect(res.status).toBe(201);
        return res.body as any;
    }

    it("deve editar parcialmente e atualizar updatedAt", async () => {
        const game = await createGame();

        const patch = {
            name: `${game.name} (editado)`,
            shortDescription: "Depois",
            tutorialSteps: ["Novo 1", "Novo 2", "Novo 3"]
        };

        const res = await request(app)
            .patch(`/api/game/games/${game.id}`)
            .set("Authorization", `Bearer ${APP_TOKEN}`)
            .send(patch);

        expect(res.status).toBe(200);
        expect(res.body.name).toBe(patch.name);
        expect(res.body.shortDescription).toBe(patch.shortDescription);
        expect(res.body.tutorialSteps).toEqual(patch.tutorialSteps);
        expect(new Date(res.body.updatedAt).getTime())
            .toBeGreaterThan(new Date(game.updatedAt).getTime());
    });

    it("deve retornar 400 para payload inválido", async () => {
        const game = await createGame();

        const bad = { name: "" }; // vazio não permitido
        const res = await request(app)
            .patch(`/api/game/games/${game.id}`)
            .set("Authorization", `Bearer ${APP_TOKEN}`)
            .send(bad);

        expect(res.status).toBe(400);
    });

    it("deve retornar 404 para id inexistente", async () => {
        const res = await request(app)
            .patch(`/api/game/games/00000000-0000-0000-0000-000000000000`)
            .set("Authorization", `Bearer ${APP_TOKEN}`)
            .send({ name: "x" });

        expect(res.status).toBe(404);
    });
});
