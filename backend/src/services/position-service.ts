import { pool } from '../db/pool.js';
import type { NormalizedPosition } from '../types/position.js';
import { upsertDevice } from './device-service.js';
import { broadcast } from './realtime.js';

export async function storePosition(input: NormalizedPosition) {
  const device = await upsertDevice(input.deviceUniqueId);
  const serverTime = new Date();

  const [result] = await pool.execute(
    `INSERT INTO positions (
      device_id, protocol, server_time, device_time, fix_time, valid,
      latitude, longitude, altitude, speed, course, accuracy, raw
    ) VALUES (
      :deviceId, :protocol, :serverTime, :deviceTime, :fixTime, TRUE,
      :latitude, :longitude, :altitude, :speed, :course, :accuracy, CAST(:raw AS JSON)
    )`,
    {
      deviceId: device.id,
      protocol: input.protocol,
      serverTime,
      deviceTime: input.deviceTime,
      fixTime: input.deviceTime ?? serverTime,
      latitude: input.latitude,
      longitude: input.longitude,
      altitude: input.altitude,
      speed: input.speed,
      course: input.course,
      accuracy: input.accuracy,
      raw: JSON.stringify(input.raw)
    }
  );

  const insertId = Number((result as { insertId: number }).insertId);

  await pool.execute('UPDATE devices SET last_position_id = :positionId WHERE id = :deviceId', {
    positionId: insertId,
    deviceId: device.id
  });

  const stored = {
    ...input,
    id: insertId,
    deviceId: device.id,
    serverTime
  };

  broadcast({ type: 'position.created', data: stored });

  return stored;
}

export async function listLatestPositions(limit = 100) {
  const [rows] = await pool.execute(
    `SELECT
       p.id, p.device_id AS deviceId, d.unique_id AS deviceUniqueId, d.name AS deviceName,
       p.protocol, p.server_time AS serverTime, p.device_time AS deviceTime,
       p.latitude, p.longitude, p.altitude, p.speed, p.course, p.accuracy
     FROM positions p
     JOIN devices d ON d.id = p.device_id
     ORDER BY p.server_time DESC
     LIMIT :limit`,
    { limit }
  );

  return rows;
}

