"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  generateKeyPair,
  exportPublicKey,
  importPublicKey,
} from "@/lib/crypto/generateKeys";
import { deriveSessionKey } from "@/lib/crypto/deriveKey";
import { encryptMessage } from "@/lib/crypto/encrypt";
import { decryptMessage } from "@/lib/crypto/decrypt";
import { useShadowSocket } from "@/lib/ws/useShadowSocket";
import { MessageBubble } from "@/components/MessageBubble";
import { MessageInput } from "@/components/MessageInput";
import { SecurityIndicator } from "@/components/SecurityIndicator";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogOut } from "lucide-react";

type Msg = {
  id: string;
  content: string;
  isOwn: boolean;
  timestamp: number;
};

export default function ChatPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const router = useRouter();

  const [messages, setMessages] = useState<Msg[]>([]);
  const [secure, setSecure] = useState(false);
  const sessionKeyRef = useRef<CryptoKey | null>(null);
  const privateKeyRef = useRef<CryptoKey | null>(null);

  // 🔌 WebSocket hook
  const socket = useShadowSocket(roomId, async (msg) => {
    // 🔑 PEER PUBLIC KEY RECEIVED
    if (msg.type === "peer-key") {
      const peerKey = await importPublicKey(msg.key);
      const sharedKey = await deriveSessionKey(privateKeyRef.current!, peerKey);

      sessionKeyRef.current = sharedKey;
      setSecure(true);
      return;
    }

    // 🔒 ENCRYPTED MESSAGE RECEIVED
    if (msg.type === "encrypted-message") {
      const plaintext = await decryptMessage(
        msg.ciphertext,
        msg.iv,
        sessionKeyRef.current!
      );

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          content: plaintext,
          isOwn: false,
          timestamp: Date.now(),
        },
      ]);
    }
  });

  // 🔐 INIT KEY EXCHANGE
  useEffect(() => {
    (async () => {
      const { publicKey, privateKey } = await generateKeyPair();
      privateKeyRef.current = privateKey;

      const exported = await exportPublicKey(publicKey);

      socket.send({
        type: "public-key",
        key: exported,
      });
    })();
  }, []);

  // ✉️ SEND MESSAGE
  const handleSend = async (text: string) => {
    if (!sessionKeyRef.current) return;

    const encrypted = await encryptMessage(text, sessionKeyRef.current);

    socket.send({
      type: "encrypted-message",
      ciphertext: encrypted.ciphertext,
      iv: encrypted.iv,
    });

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        content: text,
        isOwn: true,
        timestamp: Date.now(),
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 flex flex-col">
      <div className="max-w-2xl mx-auto w-full flex flex-col h-full">
        <div className="flex justify-between mb-4">
          <div>
            <h1 className="font-bold text-xl">ShadowTalk</h1>
            <p className="text-gray-400 text-sm">Room: {roomId}</p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => router.push("/")}
          >
            <LogOut size={14} className="mr-2" />
            End
          </Button>
        </div>

        <SecurityIndicator
          isSecure={secure}
          message={secure ? "End-to-End Encrypted" : "Exchanging keys…"}
        />

        <Card className="flex-1 my-4 bg-gray-900 p-4 overflow-y-auto">
          {messages.map((m) => (
            <MessageBubble
              key={m.id}
              content={m.content}
              isOwn={m.isOwn}
              timestamp={m.timestamp}
            />
          ))}
        </Card>

        <MessageInput
          onSend={handleSend}
          disabled={!secure}
          placeholder={secure ? "Type securely…" : "Securing…"}
        />
      </div>
    </div>
  );
}
