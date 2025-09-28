import request from "supertest";
import app from "../../src/app.ts";

describe("Join Room Rule (one room per user)", () => {
    const APP_TOKEN = process.env.APP_TOKEN || "test-token";
    beforeAll(() => (process.env.APP_TOKEN = APP_TOKEN));

    async function registerUser(nickname: string) {
        const res = await request(app)
            .post("/api/game/register-user")
            .set("Authorization", `Bearer ${APP_TOKEN}`)
            .send({ nickname });
        return res.body.id as string;
    }

    async function createRoom() {
        const res = await request(app)
            .post("/api/game/create-room")
            .set("Authorization", `Bearer ${APP_TOKEN}`)
            .send({});
        return res.body.code as string;
    }

    it("deve bloquear quando o usuário tenta entrar em uma segunda sala", async () => {
        const userId = await registerUser(`player_${Date.now()}`);
        const code1 = await createRoom();
        const code2 = await createRoom();

        // entra na primeira
        const join1 = await request(app)
            .post("/api/game/join-room")
            .set("Authorization", `Bearer ${APP_TOKEN}`)
            .send({ code: code1, userId });
        expect(join1.status).toBe(200);

        // tenta entrar na segunda
        const join2 = await request(app)
            .post("/api/game/join-room")
            .set("Authorization", `Bearer ${APP_TOKEN}`)
            .send({ code: code2, userId });
        expect(join2.status).toBe(409);
        expect(join2.body.error).toMatch(/outra sala/i);
    });

    it("deve ser idempotente quando entrar duas vezes na MESMA sala", async () => {
        const userId = await registerUser(`player_${Date.now()}`);
        const code = await createRoom();

        const a = await request(app)
            .post("/api/game/join-room")
            .set("Authorization", `Bearer ${APP_TOKEN}`)
            .send({ code, userId });
        expect(a.status).toBe(200);

        const b = await request(app)
            .post("/api/game/join-room")
            .set("Authorization", `Bearer ${APP_TOKEN}`)
            .send({ code, userId });
        expect(b.status).toBe(200);
    });
});
