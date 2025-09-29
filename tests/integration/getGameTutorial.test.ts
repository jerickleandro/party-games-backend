import request from "supertest";
import app from "../../src/app.ts";

describe("Get Game Tutorial (integration)", () => {
    const APP_TOKEN = process.env.APP_TOKEN || "test-token";
    beforeAll(() => (process.env.APP_TOKEN = APP_TOKEN));

    async function createGame() {
        const payload = {
            name: `Tutorial Game ${Date.now()}`,
            photoUrl: "https://example.com/tutorial.jpg",
            shortDescription: "Catálogo",
            description: "Descrição longa usada no tutorial",
            tutorialSteps: ["Regra 1", "Regra 2", "Regra 3"]
        };
        const res = await request(app)
            .post("/api/game/games")
            .set("Authorization", `Bearer ${APP_TOKEN}`)
            .send(payload);
        expect(res.status).toBe(201);
        return { id: res.body.id, payload };
    }

    it("deve retornar nome, descrição e steps do jogo", async () => {
        const { id, payload } = await createGame();

        const res = await request(app)
            .get(`/api/game/games/${id}/tutorial`)
            .set("Authorization", `Bearer ${APP_TOKEN}`);

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
            id,
            name: payload.name,
            description: payload.description
        });
        expect(res.body.steps).toEqual(payload.tutorialSteps);
    });

    it("deve retornar 404 para id inexistente", async () => {
        const res = await request(app)
            .get(`/api/game/games/00000000-0000-0000-0000-000000000000/tutorial`)
            .set("Authorization", `Bearer ${APP_TOKEN}`);

        expect(res.status).toBe(404);
    });
});
