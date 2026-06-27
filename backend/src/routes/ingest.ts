import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { config } from '../config.js';
import { storePosition } from '../services/position-service.js';

const osmandQuerySchema = z.object({
  id: z.string().min(1),
  lat: z.coerce.number().min(-90).max(90),
  lon: z.coerce.number().min(-180).max(180),
  timestamp: z.string().optional(),
  altitude: z.coerce.number().optional(),
  speed: z.coerce.number().optional(),
  bearing: z.coerce.number().optional(),
  accuracy: z.coerce.number().optional(),
  token: z.string().optional()
});

export async function ingestRoutes(app: FastifyInstance) {
  app.get('/api/ingest/osmand', async (request, reply) => {
    const query = osmandQuerySchema.parse(request.query);

    if (config.ingestToken && query.token !== config.ingestToken) {
      return reply.code(401).send({ error: 'Token de ingestao invalido.' });
    }

    const position = await storePosition({
      deviceUniqueId: query.id,
      protocol: 'osmand',
      deviceTime: query.timestamp ? new Date(query.timestamp) : null,
      latitude: query.lat,
      longitude: query.lon,
      altitude: query.altitude ?? null,
      speed: query.speed ?? null,
      course: query.bearing ?? null,
      accuracy: query.accuracy ?? null,
      raw: query
    });

    return { ok: true, data: position };
  });
}

