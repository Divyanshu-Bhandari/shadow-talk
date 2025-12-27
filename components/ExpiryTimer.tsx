'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface ExpiryTimerProps {
  expiresAt: number | null;
  onExpire?: () => void;
}

export function ExpiryTimer({ expiresAt, onExpire }: ExpiryTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    if (!expiresAt) return;

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, expiresAt - now);

      if (remaining === 0) {
        setTimeRemaining('Expired');
        onExpire?.();
        return;
      }

      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);

      setTimeRemaining(
        `${minutes}:${seconds.toString().padStart(2, '0')}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  if (!timeRemaining) return null;

  const isExpired = timeRemaining === 'Expired';
  const isLowTime = parseInt(timeRemaining.split(':')[0]) < 2;

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
        isExpired
          ? 'bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
          : isLowTime
          ? 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800'
          : 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-800'
      }`}
    >
      <Clock size={16} />
      <span>{timeRemaining}</span>
    </div>
  );
}
