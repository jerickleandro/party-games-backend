import request from "supertest";
import app from "../../src/app.ts";

describe("List Games (integration)", () => {
    const APP_TOKEN = process.env.APP_TOKEN || "test-token";
    beforeAll(() => (process.env.APP_TOKEN = APP_TOKEN));

    async function createGame(nameSuffix: string) {
        const payload = {
            name: `Game-${nameSuffix}-${Date.now()}`,
            photoUrl: "https://example.com/game.jpg",
            shortDescription: "Breve descrição",
            description: "Descrição longa do jogo",
            tutorialSteps: ["Passo 1", "Passo 2"]
        };
        const res = await request(app)
            .post("/api/game/games")
            .set("Authorization", `Bearer ${APP_TOKEN}`)
            .send(payload);
        expect(res.status).toBe(201);
        return res.body;
    }

    it("deve listar jogos com id, name, photoUrl e shortDescription", async () => {
        const created = await createGame("A");

        const res = await request(app)
            .get("/api/game/games")
            .set("Authorization", `Bearer ${APP_TOKEN}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        // cada item deve ter apenas os campos do catálogo
        for (const item of res.body) {
            expect(item).toHaveProperty("id");
            expect(item).toHaveProperty("name");
            expect(item).toHaveProperty("photoUrl");
            expect(item).toHaveProperty("shortDescription");
            // não deve expor description/tutorialSteps aqui
            expect(item).not.toHaveProperty("description");
            expect(item).not.toHaveProperty("tutorialSteps");
        }
        // deve conter o jogo criado
        const ids = res.body.map((g: any) => g.id);
        expect(ids).toContain(created.id);
    });
});
