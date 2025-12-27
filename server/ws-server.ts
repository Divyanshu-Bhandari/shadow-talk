import { WebSocketServer } from 'ws';

type Client = {
  socket: WebSocket;
  publicKey?: string;
};

const wss = new WebSocketServer({ port: 3001 });

const rooms = new Map<string, Client[]>();

console.log('🔐 ShadowTalk WebSocket running on ws://localhost:3001');

wss.on('connection', (socket) => {
  let roomId: string | null = null;

  socket.on('message', (raw) => {
    const msg = JSON.parse(raw.toString());

    // 1️⃣ JOIN ROOM
    if (msg.type === 'join') {
      roomId = msg.roomId;

      if (!rooms.has(roomId)) {
        rooms.set(roomId, []);
      }

      rooms.get(roomId)!.push({ socket });

      return;
    }

    // 2️⃣ RECEIVE PUBLIC KEY
    if (msg.type === 'public-key' && roomId) {
      const clients = rooms.get(roomId);
      if (!clients) return;

      const sender = clients.find(c => c.socket === socket);
      if (!sender) return;

      sender.publicKey = msg.key;

      // If both clients have keys → exchange
      if (clients.length === 2 && clients.every(c => c.publicKey)) {
        clients.forEach((client) => {
          const peerKey = clients.find(c => c !== client)!.publicKey!;
          client.socket.send(
            JSON.stringify({
              type: 'peer-key',
              key: peerKey,
            })
          );
        });
      }
    }

    // 3️⃣ ENCRYPTED MESSAGE RELAY
    if (msg.type === 'encrypted-message' && roomId) {
      const clients = rooms.get(roomId);
      if (!clients) return;

      clients
        .filter(c => c.socket !== socket)
        .forEach(c =>
          c.socket.send(JSON.stringify(msg))
        );
    }
  });

  socket.on('close', () => {
    if (!roomId) return;
    const clients = rooms.get(roomId);
    if (!clients) return;

    rooms.set(
      roomId,
      clients.filter(c => c.socket !== socket)
    );

    if (rooms.get(roomId)?.length === 0) {
      rooms.delete(roomId);
    }
  });
});
