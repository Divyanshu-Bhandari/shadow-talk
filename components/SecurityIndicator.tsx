'use client';

import { Lock, AlertCircle } from 'lucide-react';

interface SecurityIndicatorProps {
  isSecure: boolean;
  message?: string;
}

export function SecurityIndicator({ isSecure, message }: SecurityIndicatorProps) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
        isSecure
          ? 'bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
          : 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800'
      }`}
    >
      {isSecure ? (
        <>
          <Lock size={16} />
          <span>{message || 'Secure Connection'}</span>
        </>
      ) : (
        <>
          <AlertCircle size={16} />
          <span>{message || 'Establishing Connection...'}</span>
        </>
      )}
    </div>
  );
}
