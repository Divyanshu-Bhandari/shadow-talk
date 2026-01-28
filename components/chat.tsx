"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MessageBubble from "./message-bubble";
import { Share2, LogOut, Check } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  createdAt: string;
}

interface ChatProps {
  chatId: string;
  chatKey: string;
}

export default function Chat({ chatId, chatKey }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [copied, setCopied] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const shouldAutoScrollRef = useRef(true);
  const isActiveRef = useRef(true); // 🔥 visibility control

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/chat/${chatId}?key=${chatKey}`
      : "";

  /* ---------------- VISIBILITY / FOCUS ---------------- */

  useEffect(() => {
    const handleVisibility = () => {
      isActiveRef.current = document.visibilityState === "visible";
    };

    const handleFocus = () => {
      isActiveRef.current = true;
    };

    const handleBlur = () => {
      isActiveRef.current = false;
    };

    handleVisibility(); // initial state

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  /* ---------------- SCROLL HELPERS ---------------- */

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;

    const threshold = 120;
    shouldAutoScrollRef.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
  };

  const scrollToBottom = () => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  };

  /* ---------------- POLLING ---------------- */

  const pollMessages = async () => {
    if (!isActiveRef.current) return; // 🔥 STOP when tab inactive

    try {
      const res = await fetch(`/api/chat/${chatId}/poll`);
      if (!res.ok) {
        if (res.status === 410) {
          setSessionExpired(true);
          pollingRef.current && clearInterval(pollingRef.current);
        }
        return;
      }

      const { messages: incoming } = await res.json();
      if (!Array.isArray(incoming) || incoming.length === 0) return;

      setMessages((prev) => {
        const seen = new Set(prev.map((m) => m.id));
        const unique = incoming.filter((m: Message) => !seen.has(m.id));
        return unique.length ? [...prev, ...unique] : prev;
      });

      if (shouldAutoScrollRef.current) {
        requestAnimationFrame(scrollToBottom);
      }
    } catch (err) {
      console.error("Polling error:", err);
    }
  };

  useEffect(() => {
    pollMessages();
    pollingRef.current = setInterval(pollMessages, 5000);

    return () => {
      pollingRef.current && clearInterval(pollingRef.current);
    };
  }, [chatId]);

  /* ---------------- SEND MESSAGE ---------------- */

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/chat/${chatId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: inputValue }),
      });

      if (!res.ok) {
        toast.error("Failed to send message");
        return;
      }

      setInputValue("");
      pollMessages();
      requestAnimationFrame(scrollToBottom);
    } catch {
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- MISC ---------------- */

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  /* ---------------- SESSION EXPIRED ---------------- */

  if (sessionExpired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-white">Session Expired</h1>
          <p className="text-slate-300">
            This chat session has ended. All messages have been deleted.
          </p>
          <Button onClick={() => (window.location.href = "/")}>
            Create New Chat
          </Button>
        </div>
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-semibold text-white">ShadowTalk</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 text-sm"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">
                {copied ? "Copied" : "Share"}
              </span>
            </button>
            <Button
              onClick={() => (window.location.href = "/")}
              variant="destructive"
              size="sm"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-6 max-w-5xl mx-auto w-full space-y-4"
      >
        {messages.length === 0 && (
          <p className="text-center text-slate-400">
            No messages yet. Start the conversation!
          </p>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className="max-w-3xl break-words whitespace-pre-wrap"
          >
            <MessageBubble
              content={message.content}
              isOwn={false}
              timestamp={message.createdAt}
            />
          </div>
        ))}
      </div>

      {/* Input */}
      <footer className="bg-slate-800 border-t border-slate-700 px-4 py-4 sticky bottom-0">
        <form
          onSubmit={handleSendMessage}
          className="max-w-5xl mx-auto flex gap-2"
        >
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            disabled={loading}
            className="bg-slate-700 border-slate-600 text-white"
          />
          <Button
            type="submit"
            disabled={loading || !inputValue.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? "Sending..." : "Send"}
          </Button>
        </form>
      </footer>
    </div>
  );
}
