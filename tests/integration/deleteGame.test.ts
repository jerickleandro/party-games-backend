import request from "supertest";
import app from "../../src/app.ts";

describe("Delete Game (integration)", () => {
    const APP_TOKEN = process.env.APP_TOKEN || "test-token";
    beforeAll(() => (process.env.APP_TOKEN = APP_TOKEN));

    async function createGame() {
        const payload = {
            name: `Deletable ${Date.now()}`,
            photoUrl: "https://example.com/del.jpg",
            shortDescription: "Para deletar",
            description: "Será removido",
            tutorialSteps: ["Step 1"]
        };
        const res = await request(app)
            .post("/api/game/games")
            .set("Authorization", `Bearer ${APP_TOKEN}`)
            .send(payload);
        expect(res.status).toBe(201);
        return res.body as any;
    }

    it("deve excluir o jogo e não permitir acessar seu tutorial", async () => {
        const game = await createGame();

        const del = await request(app)
            .delete(`/api/game/games/${game.id}`)
            .set("Authorization", `Bearer ${APP_TOKEN}`);
        expect(del.status).toBe(200);
        expect(del.body).toEqual({ deleted: true });

        const tutorial = await request(app)
            .get(`/api/game/games/${game.id}/tutorial`)
            .set("Authorization", `Bearer ${APP_TOKEN}`);
        expect(tutorial.status).toBe(404);
    });

    it("deve retornar 404 ao excluir id inexistente", async () => {
        const res = await request(app)
            .delete(`/api/game/games/00000000-0000-0000-0000-000000000000`)
            .set("Authorization", `Bearer ${APP_TOKEN}`);
        expect(res.status).toBe(404);
    });
});
