import dotenv from 'dotenv';
dotenv.config();


export const config = {
    port: Number(process.env.PORT ?? 3000),
    corsOrigin: (process.env.CORS_ORIGIN ?? '*').split(',').map(s => s.trim()),
    timings: {
        writingMs: 75_000,
        defenseMs: 25_000,
        discussionMs: 300_000,
    },
};