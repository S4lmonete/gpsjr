import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { listLatestPositions } from '../services/position-service.js';

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(500).default(100)
});

export async function positionRoutes(app: FastifyInstance) {
  app.get('/api/positions/latest', async (request) => {
    const query = querySchema.parse(request.query);

    return { data: await listLatestPositions(query.limit) };
  });
}

