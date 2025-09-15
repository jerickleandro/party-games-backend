import express from 'express';
import http from 'http';
import cors from 'cors';
import { config } from '../config';
import { attachSocket } from './socket';


export function createHttpServer() {
    const app = express();
    app.use(cors({ origin: config.corsOrigin }));
    app.get('/health', (_req, res) => res.json({ ok: true }));
    const server = http.createServer(app);
    attachSocket(server);
    return { app, server };
}