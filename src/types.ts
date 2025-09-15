export type Phase = 'lobby' | 'writing' | 'defense' | 'discussion' | 'scoring' | 'finished';


export type Player = {
    id: string; // socket.id
    name: string;
    connected: boolean;
    score: number;
};


export type Submission = {
    playerId: string;
    text: string;
    normalizedKey: string; // usado para anti-duplicata
    valid: boolean;
    submittedAt: number;
};


export type Vote = { voterId: string; targetPlayerId: string; createdAt: number };


export type Round = {
    id: string;
    theme: string;
    letter: string;
    submissions: Record<string, Submission>; // key = playerId
    defensesOrder: string[]; // playerIds
    defenseIndex: number; // quem está defendendo agora
    votes: Vote[];
    phase: Exclude<Phase, 'lobby' | 'finished'>;
    timers: { writingMs: number; defenseMs: number; discussionMs: number };
    timeouts: NodeJS.Timeout[];
};


export type Room = {
    code: string;
    ownerId: string;
    createdAt: number;
    status: Exclude<Phase, 'writing' | 'defense' | 'discussion' | 'scoring'>; // lobby | finished
    players: Record<string, Player>;
    roundIndex: number;
    rounds: Round[];
};