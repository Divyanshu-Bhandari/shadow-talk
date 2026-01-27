'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Lock, Zap, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function Landing() {
  const [loading, setLoading] = useState(false);

  const handleCreateChat = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/chat/create', {
        method: 'POST',
      });

      if (!response.ok) {
        toast.error('Failed to create chat');
        return;
      }

      const { id, key } = await response.json();
      const shareUrl = `${window.location.origin}/chat/${id}?key=${key}`;

      window.location.href = shareUrl;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to create chat');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Lock className="w-8 h-8 text-blue-400" />
            <h1 className="text-5xl font-bold text-white">ShadowTalk</h1>
          </div>
          <p className="text-xl text-slate-300">
            Private, temporary chat. No accounts. No history.
          </p>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Share a link, chat for 15 minutes, then everything disappears. Complete privacy, zero traces.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
          <Card className="bg-slate-700 border-slate-600 p-6 space-y-3">
            <Lock className="w-6 h-6 text-blue-400" />
            <h3 className="font-semibold text-white">End-to-End Private</h3>
            <p className="text-sm text-slate-300">
              No login required. No tracking. Just pure temporary communication.
            </p>
          </Card>

          <Card className="bg-slate-700 border-slate-600 p-6 space-y-3">
            <Zap className="w-6 h-6 text-amber-400" />
            <h3 className="font-semibold text-white">Instant Connection</h3>
            <p className="text-sm text-slate-300">
              Create a chat in seconds. Share the link. Start talking immediately.
            </p>
          </Card>

          <Card className="bg-slate-700 border-slate-600 p-6 space-y-3">
            <Trash2 className="w-6 h-6 text-red-400" />
            <h3 className="font-semibold text-white">Auto-Delete</h3>
            <p className="text-sm text-slate-300">
              Messages vanish after 15 minutes. No permanent storage. Zero history.
            </p>
          </Card>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={handleCreateChat}
            disabled={loading}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white h-12 text-base"
          >
            {loading ? 'Creating...' : 'Create New Chat'}
          </Button>
        </div>

        <div className="bg-slate-700 rounded-lg p-6 space-y-3">
          <h3 className="font-semibold text-white">How it works</h3>
          <ol className="text-sm text-slate-300 space-y-2">
            <li className="flex gap-3">
              <span className="text-blue-400 font-semibold">1.</span>
              <span>Click "Create New Chat" to generate a unique link</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-400 font-semibold">2.</span>
              <span>Share the link with someone else</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-400 font-semibold">3.</span>
              <span>Chat with 4-second message delivery</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-400 font-semibold">4.</span>
              <span>Session auto-expires after 15 minutes—all data deleted</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
