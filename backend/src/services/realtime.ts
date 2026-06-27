import type { WebSocket } from '@fastify/websocket';

const clients = new Set<WebSocket>();

export function addRealtimeClient(socket: WebSocket) {
  clients.add(socket);
  socket.on('close', () => clients.delete(socket));
  socket.on('message', () => {
    socket.send(JSON.stringify({ type: 'pong', sentAt: new Date().toISOString() }));
  });
}

export function broadcast(event: unknown) {
  const payload = JSON.stringify(event);

  for (const client of clients) {
    if (client.readyState === client.OPEN) {
      client.send(payload);
    }
  }
}
