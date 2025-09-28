import request from "supertest";
import app from "../../src/app.ts";

describe("Close Room (integration)", () => {
    const APP_TOKEN = process.env.APP_TOKEN || "test-token";
    beforeAll(() => {
        process.env.APP_TOKEN = APP_TOKEN;
    });

    async function registerUser(nickname: string) {
        const res = await request(app)
            .post("/api/game/register-user")
            .set("Authorization", `Bearer ${APP_TOKEN}`)
            .send({ nickname });
        expect(res.status).toBe(201);
        return res.body.id as string;
    }

    async function createRoom() {
        const res = await request(app)
            .post("/api/game/create-room")
            .set("Authorization", `Bearer ${APP_TOKEN}`)
            .send({});
        expect(res.status).toBe(201);
        return { code: res.body.code as string, roomId: res.body.id as string };
    }

    async function joinRoom(code: string, userId: string) {
        const res = await request(app)
            .post("/api/game/join-room")
            .set("Authorization", `Bearer ${APP_TOKEN}`)
            .send({ code, userId });
        expect([200, 201]).toContain(res.status);
        return res.body;
    }

    async function closeRoom(code: string) {
        const res = await request(app)
            .post("/api/game/close-room")
            .set("Authorization", `Bearer ${APP_TOKEN}`)
            .send({ code });
        return res;
    }

    async function listMembers(code: string) {
        const res = await request(app)
            .get(`/api/game/rooms/${code}/members`)
            .set("Authorization", `Bearer ${APP_TOKEN}`);
        return res;
    }

    it("deve limpar todos os memberships e manter a sala existente (members=[]) ", async () => {
        const u1 = await registerUser(`closeA_${Date.now()}_1`);
        const u2 = await registerUser(`closeA_${Date.now()}_2`);

        const { code } = await createRoom();
        await joinRoom(code, u1);
        await joinRoom(code, u2);

        const before = await listMembers(code);
        expect(before.status).toBe(200);
        expect(before.body.members.length).toBe(2);

        const closed = await closeRoom(code);
        expect(closed.status).toBe(200);
        expect(closed.body).toMatchObject({ code });
        expect(typeof closed.body.removedCount).toBe("number");
        expect(closed.body.removedCount).toBeGreaterThanOrEqual(2);

        const after = await listMembers(code);
        expect(after.status).toBe(200);
        expect(Array.isArray(after.body.members)).toBe(true);
        expect(after.body.members.length).toBe(0);
    });

    it("deve retornar 404 para código inexistente", async () => {
        const res = await closeRoom("999999");
        expect(res.status).toBe(404);
    });

    it("deve retornar 400 para código inválido (não 6 dígitos)", async () => {
        const res = await closeRoom("12a45");
        expect(res.status).toBe(400);
    });
});
