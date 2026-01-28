"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lock, Zap, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Landing() {
  const [loading, setLoading] = useState(false);

  const handleCreateChat = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/chat/create", {
        method: "POST",
      });

      if (!response.ok) {
        toast.error("Failed to create chat");
        return;
      }

      const { code } = await response.json();

      // ✅ single, clean redirect
      window.location.href = `/chat/${code}`;
    } catch (error) {
      console.error(error);
      toast.error("Failed to create chat");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* ---------- HERO ---------- */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-3xl space-y-10">
          {/* Title */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Lock className="w-9 h-9 text-blue-400" />
              <h1 className="text-4xl sm:text-5xl font-bold text-white">
                ShadowTalk
              </h1>
            </div>
            <p className="text-lg sm:text-xl text-slate-300">
              Private. Temporary. No accounts.
            </p>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Create a short link, chat for 15 minutes, then everything
              disappears forever.
            </p>
          </div>

          {/* CTA (always visible on mobile) */}
          <div className="flex justify-center">
            <Button
              onClick={handleCreateChat}
              disabled={loading}
              size="lg"
              className="w-full sm:w-auto px-8 h-12 text-base bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Creating…" : "Create New Chat"}
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-slate-700 border-slate-600 p-5 space-y-3">
              <Lock className="w-6 h-6 text-blue-400" />
              <h3 className="font-semibold text-white">Private</h3>
              <p className="text-sm text-slate-300">
                No login, no tracking, no identity.
              </p>
            </Card>

            <Card className="bg-slate-700 border-slate-600 p-5 space-y-3">
              <Zap className="w-6 h-6 text-amber-400" />
              <h3 className="font-semibold text-white">Instant</h3>
              <p className="text-sm text-slate-300">
                Share a short link and start chatting.
              </p>
            </Card>

            <Card className="bg-slate-700 border-slate-600 p-5 space-y-3">
              <Trash2 className="w-6 h-6 text-red-400" />
              <h3 className="font-semibold text-white">Auto-Delete</h3>
              <p className="text-sm text-slate-300">
                Messages vanish after 15 minutes.
              </p>
            </Card>
          </div>

          {/* How it works */}
          <div className="bg-slate-800/70 rounded-xl p-6 space-y-3">
            <h3 className="font-semibold text-white">How it works</h3>
            <ol className="text-sm text-slate-300 space-y-2">
              <li>1. Create a chat</li>
              <li>2. Share the short link</li>
              <li>3. Only two people can join</li>
              <li>4. Chat auto-expires in 15 minutes</li>
            </ol>
          </div>
        </div>
      </main>

      {/* ---------- FOOTER ---------- */}
      <footer className="text-center text-xs text-slate-500 pb-4">
        No cookies • No accounts • No history
      </footer>
    </div>
  );
}
