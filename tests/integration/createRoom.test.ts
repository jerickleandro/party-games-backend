import request from "supertest";
import app from "../../src/app.ts";

describe("Create Room (integration)", () => {
    const APP_TOKEN = process.env.APP_TOKEN || "test-token";

    beforeAll(() => {
        process.env.APP_TOKEN = APP_TOKEN;
    });

    it("deve criar uma sala, retornar 201 e code de 6 dígitos", async () => {
        const res = await request(app)
            .post("/api/game/create-room")
            .set("Authorization", `Bearer ${APP_TOKEN}`)
            .send({});

        expect(res.status).toBe(201);
        expect(res.headers.location).toMatch(/\/api\/game\/rooms\/.+/);
        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty("code");
        expect(res.body.code).toMatch(/^\d{6}$/);
    });

    it("deve aceitar identification opcional", async () => {
        const res = await request(app)
            .post("/api/game/create-room")
            .set("Authorization", `Bearer ${APP_TOKEN}`)
            .send({ identification: "match-owner-123" });

        expect(res.status).toBe(201);
        expect(res.body.identification).toBe("match-owner-123");
    });
});
