import { Server } from 'socket.io';
import { config } from '../config';
import { Room, Player, Round, Vote } from '../types';
import { RoomStore } from './roomStore';
import { normalizeTitle } from '../utils/normalize';
import { pickLetter, pickTheme } from './themeLetter';
import { shuffle, uid } from '../utils/random';

function publicRoom(room: Room) {
    // remove infos sensíveis (se houver). Aqui já é "seguro".
    return room;
}

export const GameEngine = (io: Server) => {
    function broadcast(code: string) {
        const room = RoomStore.get(code);
        if (room) io.to(code).emit('room:state', { room: publicRoom(room) });
    }

    function createRoom(ownerId: string, ownerName: string): Room {
        let code = uid(6);
        while (RoomStore.get(code)) code = uid(6);
        const now = Date.now();
        const owner: Player = { id: ownerId, name: ownerName, connected: true, score: 0 };
        const room: Room = {
            code,
            ownerId,
            createdAt: now,
            status: 'lobby',
            players: { [ownerId]: owner },
            roundIndex: -1,
            rounds: [],
        };
        RoomStore.create(room);
        return room;
    }

    function joinRoom(code: string, id: string, name: string): Room | null {
        const room = RoomStore.get(code);
        if (!room) return null;
        room.players[id] = { id, name, connected: true, score: room.players[id]?.score ?? 0 };
        return room;
    }

    function startRound(code: string) {
        const room = RoomStore.get(code);
        if (!room) return;
        const round: Round = {
            id: uid(8),
            theme: pickTheme(),
            letter: pickLetter(),
            submissions: {},
            defensesOrder: [],
            defenseIndex: -1,
            votes: [],
            phase: 'writing',
            timers: config.timings,
            timeouts: [],
        };
        room.status = 'in_round' as any; // somente informativo
        room.roundIndex += 1;
        room.rounds.push(round);


        io.to(code).emit('round:started', { round });
        tickPhase(code, 'writing');
    }

    function clearTimeouts(round: Round) {
        for (const t of round.timeouts) clearTimeout(t);
        round.timeouts = [];
    }

    function schedule(round: Round, ms: number, fn: () => void) {
        const t = setTimeout(fn, ms);
        round.timeouts.push(t);
    }

    function tickPhase(code: string, phase: Round['phase']) {
        const room = RoomStore.get(code);
        if (!room) return;
        const round = room.rounds[room.roundIndex];
        round.phase = phase;


        switch (phase) {
            case 'writing': {
                io.to(code).emit('round:phase', { status: 'writing', remainingMs: round.timers.writingMs });
                schedule(round, round.timers.writingMs, () => beginDefense(code));
                break;
            }
            case 'defense': {
                io.to(code).emit('round:phase', { status: 'defense', remainingMs: round.timers.defenseMs });
                break;
            }
            case 'discussion': {
                io.to(code).emit('round:phase', { status: 'discussion', remainingMs: round.timers.discussionMs });
                schedule(round, round.timers.discussionMs, () => scoreRound(code));
                break;
            }
            case 'scoring': {
                io.to(code).emit('round:phase', { status: 'scoring', remainingMs: 0 });
                break;
            }
        }
        broadcast(code);
    }

    function handleSubmission(code: string, playerId: string, text: string) {
        const room = RoomStore.get(code); if (!room) return;
        const round = room.rounds[room.roundIndex]; if (!round || round.phase !== 'writing') return;
        const normalizedKey = normalizeTitle(text);


        // primeira ocorrência vence
        const duplicate = Object.values(round.submissions).some(s => s.normalizedKey === normalizedKey && s.valid);
        const submission = {
            playerId, text, normalizedKey, valid: !duplicate, submittedAt: Date.now()
        };
        round.submissions[playerId] = submission;
        broadcast(code);
    }

    function beginDefense(code: string) {
        const room = RoomStore.get(code); if (!room) return;
        const round = room.rounds[room.roundIndex]; if (!round) return;


        // ordem de defesa somente de válidos
        const validPlayers = Object.values(round.submissions)
            .filter(s => s.valid)
            .sort((a, b) => a.submittedAt - b.submittedAt) // estável/justo
            .map(s => s.playerId);


        round.defensesOrder = shuffle(validPlayers);
        round.defenseIndex = -1;


        const next = () => {
            const idx = ++round.defenseIndex;
            if (idx >= round.defensesOrder.length) {
                // acabou defesas → discussão
                tickPhase(code, 'discussion');
                return;
            }
            const currentPlayerId = round.defensesOrder[idx];
            io.to(code).emit('round:defenseTurn', { playerId: currentPlayerId, remainingMs: round.timers.defenseMs });
            tickPhase(code, 'defense');
            schedule(round, round.timers.defenseMs, next);
            broadcast(code);
        };


        next();
    }

    function handleVote(code: string, voterId: string, targetPlayerId: string) {
        const room = RoomStore.get(code); if (!room) return;
        const round = room.rounds[room.roundIndex]; if (!round || round.phase !== 'discussion') return;
        if (voterId === targetPlayerId) return; // sem voto em si mesmo


        // um voto por votante
        const already = round.votes.find(v => v.voterId === voterId);
        if (already) return;


        // só pode votar em quem teve submissão válida
        const isValidTarget = !!Object.values(round.submissions).find(s => s.playerId === targetPlayerId && s.valid);
        if (!isValidTarget) return;


        const vote: Vote = { voterId, targetPlayerId, createdAt: Date.now() };
        round.votes.push(vote);
        broadcast(code);
    }

    function scoreRound(code: string) {
        const room = RoomStore.get(code); if (!room) return;
        const round = room.rounds[room.roundIndex]; if (!round) return;
        clearTimeouts(round);
        round.phase = 'scoring';


        const count: Record<string, number> = {};
        for (const v of round.votes) {
            count[v.targetPlayerId] = (count[v.targetPlayerId] ?? 0) + 1;
        }


        const validSubmitters = Object.values(round.submissions).filter(s => s.valid).map(s => s.playerId);
        for (const pid of validSubmitters) {
            const votes = count[pid] ?? 0;
            room.players[pid].score += votes * 5;
        }


        const maxVotes = Math.max(0, ...Object.values(count));
        const leaders = Object.entries(count).filter(([, v]) => v === maxVotes).map(([pid]) => pid);
        for (const pid of leaders) {
            room.players[pid].score += 5; // bônus
        }


        io.to(code).emit('round:results', {
            scoresDelta: count,
            leaderboard: Object.values(room.players).sort((a, b) => b.score - a.score),
        });


        // pronto para próxima rodada (manualmente pelo host) ou encerrar
        broadcast(code);
    }

    // exposição pública do engine
    return {
        createRoom,
        joinRoom,
        startRound,
        handleSubmission,
        handleVote,
    };
};