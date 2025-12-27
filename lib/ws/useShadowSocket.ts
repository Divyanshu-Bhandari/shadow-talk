import { useEffect, useRef } from 'react';

export function useShadowSocket(
  roomId: string,
  onMessage: (msg: any) => void
) {
  const socketRef = useRef<WebSocket | null>(null);
  const queueRef = useRef<any[]>([]);
  const isOpenRef = useRef(false);
  const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL ??
  "ws://localhost:3001";
  useEffect(() => {

    const socket = new WebSocket(WS_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      isOpenRef.current = true;

      // Join room
      socket.send(JSON.stringify({ type: 'join', roomId }));

      // Flush queued messages
      queueRef.current.forEach((msg) => {
        socket.send(JSON.stringify(msg));
      });
      queueRef.current = [];
    };

    socket.onmessage = (event) => {
      onMessage(JSON.parse(event.data));
    };

    socket.onclose = () => {
      isOpenRef.current = false;
    };

    return () => socket.close();
  }, [roomId]);

  return {
    send: (data: any) => {
      if (!socketRef.current) return;

      if (isOpenRef.current) {
        socketRef.current.send(JSON.stringify(data));
      } else {
        // Queue until socket opens
        queueRef.current.push(data);
      }
    },
  };
}
