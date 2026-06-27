import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
import Fastify from 'fastify';
import { config } from './config.js';
import { deviceRoutes } from './routes/devices.js';
import { healthRoutes } from './routes/health.js';
import { ingestRoutes } from './routes/ingest.js';
import { positionRoutes } from './routes/positions.js';
import { addRealtimeClient } from './services/realtime.js';

const app = Fastify({
  logger: true
});

await app.register(cors, {
  origin: config.corsOrigin === '*' ? true : config.corsOrigin
});
await app.register(websocket);

app.get('/ws', { websocket: true }, (socket) => {
  addRealtimeClient(socket);
});

await app.register(healthRoutes);
await app.register(deviceRoutes);
await app.register(positionRoutes);
await app.register(ingestRoutes);

await app.listen({ port: config.port, host: '0.0.0.0' });

