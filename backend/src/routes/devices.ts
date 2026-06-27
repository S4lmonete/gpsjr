import type { FastifyInstance } from 'fastify';
import { listDevices } from '../services/device-service.js';

export async function deviceRoutes(app: FastifyInstance) {
  app.get('/api/devices', async () => {
    return { data: await listDevices() };
  });
}

