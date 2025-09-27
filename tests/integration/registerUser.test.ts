import request from "supertest";
import app from "../../src/app.ts";

describe("Register User (integration)", () => {
    const APP_TOKEN = process.env.APP_TOKEN || "test-token";

    beforeAll(() => {
        // garante que o middleware vai aceitar o token nos testes
        process.env.APP_TOKEN = APP_TOKEN;
    });

    it("deve registrar um usuário e retornar 201", async () => {
        const nickname = `player_${Date.now()}`;

        const res = await request(app)
            .post("/api/game/register-user")
            .set("Authorization", `Bearer ${APP_TOKEN}`)
            .send({ nickname });

        expect(res.status).toBe(201);
        expect(res.headers.location).toMatch(/\/api\/game\/users\/.+/);
        expect(res.body).toMatchObject({
            nickname
        });
        expect(typeof res.body.id).toBe("string");
        expect(new Date(res.body.createdAt).toString()).not.toBe("Invalid Date");
    });

    it("deve bloquear nickname duplicado (409)", async () => {
        const nickname = `player_${Date.now()}`;

        await request(app)
            .post("/api/game/register-user")
            .set("Authorization", `Bearer ${APP_TOKEN}`)
            .send({ nickname });

        const res2 = await request(app)
            .post("/api/game/register-user")
            .set("Authorization", `Bearer ${APP_TOKEN}`)
            .send({ nickname });

        expect(res2.status).toBe(409);
        expect(res2.body).toHaveProperty("error");
    });
});
