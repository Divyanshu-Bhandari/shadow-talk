"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useChatStore } from "@/lib/store/chatStore";
import { generateKeyPair } from "@/lib/crypto/generateKeys";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SecurityIndicator } from "@/components/SecurityIndicator";
import { ExpiryTimer } from "@/components/ExpiryTimer";
import { Copy, CheckCircle2, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";

export default function CreateChatPage() {
  const {
    clientId,
    roomId,
    setClientId,
    setRoomId,
    setKeys,
    setRoomExpiry,
    setError,
  } = useChatStore();

  const [loading, setLoading] = useState(true);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // 🔒 Guard to prevent double execution in React Strict Mode
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const init = async () => {
      try {
        // 1️⃣ Client identity
        if (!clientId) {
          setClientId(crypto.randomUUID());
        }

        // 2️⃣ Generate encryption keys once
        const keyPair = await generateKeyPair();
        setKeys(keyPair.publicKey, keyPair.privateKey);

        // 3️⃣ Create room
        const res = await fetch("/api/chat/create", { method: "POST" });
        if (!res.ok) throw new Error("Failed to create room");

        const data = await res.json();

        setRoomId(data.roomId);

        const expiry = new Date(data.expiresAt).getTime();
        setExpiresAt(expiry);
        setRoomExpiry(expiry);

        console.log("[ShadowTalk] Room created:", data.roomId);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Room creation failed";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const inviteLink =
    typeof window !== "undefined" && roomId
      ? `${window.location.origin}/chat/${roomId}`
      : "";

  const copyInviteLink = async () => {
    if (!inviteLink) return;
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast.success("Invite link copied");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Creating secure room…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white p-6">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-gray-300 mb-6 inline-block"
        >
          ← Back to Home
        </Link>

        <div className="flex items-center gap-2 mb-2">
          <Lock className="w-6 h-6 text-blue-400" />
          <h1 className="text-3xl font-bold">New Chat Room</h1>
        </div>

        <p className="text-gray-400 mb-6">
          Encryption keys generated locally. Share the link to begin.
        </p>

        <Card className="bg-gray-800/50 border border-gray-700/50 p-6 mb-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Room ID
              </label>
              <input
                readOnly
                value={roomId ?? ""}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Invite Link
              </label>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={inviteLink}
                  className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm"
                />
                <Button onClick={copyInviteLink} size="sm" variant="outline">
                  {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                </Button>
              </div>
            </div>

            <SecurityIndicator
              isSecure
              message="End-to-end encryption active"
            />
            <ExpiryTimer expiresAt={expiresAt} />
          </div>
        </Card>

        <Link href={`/chat/${roomId}`}>
          <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
            Enter Chat
          </Button>
        </Link>
      </div>
    </div>
  );
}
