import request from "supertest";
import app from "../../src/app.ts";

describe("List Room Members (integration)", () => {
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

    it("deve listar os membros (nickname incluso) por código da sala", async () => {
        const userA = await registerUser(`alpha_${Date.now()}`);
        const userB = await registerUser(`beta_${Date.now()}`);
        const code = await createRoom();

        await request(app)
            .post("/api/game/join-room")
            .set("Authorization", `Bearer ${APP_TOKEN}`)
            .send({ code, userId: userA });

        await request(app)
            .post("/api/game/join-room")
            .set("Authorization", `Bearer ${APP_TOKEN}`)
            .send({ code, userId: userB });

        const list = await request(app)
            .get(`/api/game/rooms/${code}/members`)
            .set("Authorization", `Bearer ${APP_TOKEN}`)
            .send();

        expect(list.status).toBe(200);
        expect(list.body.code).toBe(code);
        expect(Array.isArray(list.body.members)).toBe(true);
        expect(list.body.members.length).toBe(2);
        for (const m of list.body.members) {
            expect(typeof m.userId).toBe("string");
            expect(m.nickname === null || typeof m.nickname === "string").toBe(true);
            expect(new Date(m.joinedAt).toString()).not.toBe("Invalid Date");
        }
    });

    it("deve retornar 404 para sala inexistente", async () => {
        const res = await request(app)
            .get("/api/game/rooms/999999/members")
            .set("Authorization", `Bearer ${APP_TOKEN}`);
        expect(res.status).toBe(404);
    });
});
