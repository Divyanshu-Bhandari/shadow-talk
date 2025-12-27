'use client';

import { formatDistanceToNow } from 'date-fns';

interface MessageBubbleProps {
  content: string;
  isOwn: boolean;
  timestamp: number;
  isLarge?: boolean;
}

export function MessageBubble({
  content,
  isOwn,
  timestamp,
  isLarge,
}: MessageBubbleProps) {
  const date = new Date(timestamp);
  const timeAgo = formatDistanceToNow(date, { addSuffix: true });

  return (
    <div
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3 animate-in fade-in slide-in-from-bottom-2 duration-300`}
    >
      <div
        className={`max-w-sm rounded-lg px-4 py-2 ${
          isOwn
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
        } ${isLarge ? 'max-w-2xl' : ''}`}
      >
        <p className="text-sm break-words whitespace-pre-wrap">{content}</p>
        <p
          className={`text-xs mt-1 ${
            isOwn
              ? 'text-blue-100 dark:text-blue-200'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {timeAgo}
        </p>
      </div>
    </div>
  );
}
