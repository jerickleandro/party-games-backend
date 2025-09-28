import request from "supertest";
import app from "../../src/app.ts";

describe("Leave Room (integration)", () => {
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

    async function listMembers(code: string) {
        const res = await request(app)
            .get(`/api/game/rooms/${code}/members`)
            .set("Authorization", `Bearer ${APP_TOKEN}`);
        return res;
    }

    it("deve remover o usuário da sala e retornar left=true", async () => {
        const userId = await registerUser(`leaveA_${Date.now()}`);
        const { code } = await createRoom();
        await joinRoom(code, userId);

        const leave = await request(app)
            .post("/api/game/leave-room")
            .set("Authorization", `Bearer ${APP_TOKEN}`)
            .send({ code, userId });

        expect(leave.status).toBe(200);
        expect(leave.body).toMatchObject({ code, userId, left: true });

        const membersRes = await listMembers(code);
        expect(membersRes.status).toBe(200);
        const ids = membersRes.body.members.map((m: any) => m.userId);
        expect(ids).not.toContain(userId);
    });

    it("deve ser idempotente: segunda saída retorna left=false", async () => {
        const userId = await registerUser(`leaveB_${Date.now()}`);
        const { code } = await createRoom();
        await joinRoom(code, userId);

        const first = await request(app)
            .post("/api/game/leave-room")
            .set("Authorization", `Bearer ${APP_TOKEN}`)
            .send({ code, userId });
        expect(first.status).toBe(200);
        expect(first.body.left).toBe(true);

        const second = await request(app)
            .post("/api/game/leave-room")
            .set("Authorization", `Bearer ${APP_TOKEN}`)
            .send({ code, userId });
        expect(second.status).toBe(200);
        expect(second.body.left).toBe(false);
    });

    it("deve retornar 404 ao sair de sala inexistente", async () => {
        const userId = await registerUser(`leaveC_${Date.now()}`);
        const res = await request(app)
            .post("/api/game/leave-room")
            .set("Authorization", `Bearer ${APP_TOKEN}`)
            .send({ code: "999999", userId });
        expect(res.status).toBe(404);
    });

    it("deve retornar 400 para code inválido", async () => {
        const userId = await registerUser(`leaveD_${Date.now()}`);
        const res = await request(app)
            .post("/api/game/leave-room")
            .set("Authorization", `Bearer ${APP_TOKEN}`)
            .send({ code: "12A45", userId });
        expect(res.status).toBe(400);
    });
});
