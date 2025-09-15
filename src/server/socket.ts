import { Server } from 'socket.io';
import { GameEngine } from '../game/engine';


export function attachSocket(httpServer: any) {
    const io = new Server(httpServer, { cors: { origin: '*', methods: ['GET', 'POST'] } });
    const engine = GameEngine(io);


    io.on('connection', (socket) => {
        // criar sala
        socket.on('room:create', ({ nickname }, cb) => {
            const room = engine.createRoom(socket.id, nickname);
            socket.join(room.code);
            cb?.({ roomCode: room.code, playerId: socket.id, room });
        });


        // entrar em sala
        socket.on('room:join', ({ roomCode, nickname }, cb) => {
            const room = engine.joinRoom(roomCode, socket.id, nickname);
            if (!room) { cb?.({ error: 'ROOM_NOT_FOUND' }); return; }
            socket.join(room.code);
            cb?.({ room, playerId: socket.id });
            io.to(room.code).emit('room:state', { room });
        });


        socket.on('room:start', ({ roomCode }) => engine.startRound(roomCode));
        socket.on('round:submit', ({ roomCode, text }) => engine.handleSubmission(roomCode, socket.id, text));
        socket.on('round:vote', ({ roomCode, targetPlayerId }) => engine.handleVote(roomCode, socket.id, targetPlayerId));


        socket.on('disconnect', () => { /* opcional: marcar conectado=false */ });
    });


    return io;
}