import { pool } from '../db/pool.js';

export async function upsertDevice(uniqueId: string) {
  await pool.execute(
    `INSERT INTO devices (unique_id, name, status, last_seen_at)
     VALUES (:uniqueId, :name, 'online', UTC_TIMESTAMP())
     ON DUPLICATE KEY UPDATE status = 'online', last_seen_at = UTC_TIMESTAMP()`,
    { uniqueId, name: uniqueId }
  );

  const [rows] = await pool.execute('SELECT id, unique_id AS uniqueId, name, status FROM devices WHERE unique_id = :uniqueId', {
    uniqueId
  });

  return (rows as Array<{ id: number; uniqueId: string; name: string; status: string }>)[0];
}

export async function listDevices() {
  const [rows] = await pool.execute(
    `SELECT id, unique_id AS uniqueId, name, model, phone, status, last_seen_at AS lastSeenAt
     FROM devices
     ORDER BY name ASC`
  );

  return rows;
}

