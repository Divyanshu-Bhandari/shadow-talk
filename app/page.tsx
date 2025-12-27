'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Lock, Eye, Zap, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  const features = [
    {
      icon: Eye,
      title: 'No Signup',
      description: 'Start chatting instantly without creating an account',
    },
    {
      icon: Trash2,
      title: 'Auto-Delete',
      description: 'Messages vanish when the conversation ends',
    },
    {
      icon: Zap,
      title: 'Temporary',
      description: 'Every chat expires in 15 minutes',
    },
    {
      icon: Lock,
      title: 'End-to-End Encrypted',
      description: 'Only you and your chat partner can read messages',
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white overflow-hidden">

      {/* 🔒 Background Effects (NON-INTERACTIVE) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-700/20 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-28">

        {/* Header */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <Lock className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              ShadowTalk
            </h1>
          </div>

          <p className="text-xl sm:text-2xl text-gray-300 mb-6 font-light">
            Anonymous. Encrypted. Temporary.
          </p>

          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Secure chat with zero accounts, no logs, and automatic deletion.
            Talk freely. Talk safely.
          </p>
          <Link href="/chat/new">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg
                       transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30
                       active:scale-95"
            >
              Start Secure Chat
            </Button>
          </Link>

          <div className="mt-6 text-sm text-gray-500">
            No signup required • Messages auto-delete • 15 minute rooms
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700/50
                           rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300
                           hover:shadow-lg hover:shadow-blue-500/10"
              >
                <div className="mb-4">
                  <Icon className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* How it works */}
        <div className="mt-20 sm:mt-28 text-center">
          <div className="inline-block bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg px-6 py-4">
            <p className="text-sm text-gray-300 mb-2">How it works:</p>
            <p className="text-gray-400 text-xs leading-relaxed">
              Create a room → Share the link → Exchange encryption keys → Chat securely
              <br />
              All encryption happens in your browser. Server only relays encrypted messages.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
