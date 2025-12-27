import { WebSocketServer, WebSocket } from "ws";

type Client = {
  socket: WebSocket;
  publicKey?: string;
};

const PORT = Number(process.env.PORT) || 3001;
const wss = new WebSocketServer({ port: PORT });

const rooms = new Map<string, Client[]>();

console.log(`🔐 ShadowTalk WebSocket running on port ${PORT}`);

wss.on("connection", (socket) => {
  let roomId: string | null = null;

  socket.on("message", (raw) => {
    const msg = JSON.parse(raw.toString());

    // 1️⃣ JOIN ROOM
    if (msg.type === "join" && typeof msg.roomId === "string") {
      const rid = msg.roomId;   // ✅ string
      roomId = rid;

      if (!rooms.has(rid)) {
        rooms.set(rid, []);
      }

      rooms.get(rid)!.push({ socket });
      return;
    }

    // 🚨 Guard
    if (!roomId) return;
    const rid = roomId; // ✅ string

    // 2️⃣ PUBLIC KEY
    if (msg.type === "public-key") {
      const clients = rooms.get(rid);
      if (!clients) return;

      const sender = clients.find((c) => c.socket === socket);
      if (!sender) return;

      sender.publicKey = msg.key;

      if (clients.length === 2 && clients.every((c) => c.publicKey)) {
        clients.forEach((client) => {
          const peerKey = clients.find((c) => c !== client)!.publicKey!;
          client.socket.send(
            JSON.stringify({ type: "peer-key", key: peerKey })
          );
        });
      }
    }

    // 3️⃣ RELAY MESSAGE
    if (msg.type === "encrypted-message") {
      const clients = rooms.get(rid);
      if (!clients) return;

      clients
        .filter((c) => c.socket !== socket)
        .forEach((c) => c.socket.send(JSON.stringify(msg)));
    }
  });

  socket.on("close", () => {
    if (!roomId) return;
    const rid = roomId;

    const clients = rooms.get(rid);
    if (!clients) return;

    const remaining = clients.filter((c) => c.socket !== socket);

    if (remaining.length === 0) {
      rooms.delete(rid);
    } else {
      rooms.set(rid, remaining);
    }
  });
});
