import type { FastifyInstance } from 'fastify';
import { pool } from '../db/pool.js';

export async function healthRoutes(app: FastifyInstance) {
  app.get('/health', async () => {
    await pool.query('SELECT 1');

    return {
      ok: true,
      name: 'GPSJr API',
      checkedAt: new Date().toISOString()
    };
  });
}

