'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';

interface SecureNoteProps {
  content: string;
  isOwn: boolean;
  timestamp: number;
}

export function SecureNote({ content, isOwn, timestamp }: SecureNoteProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const date = new Date(timestamp);
  const timeAgo = formatDistanceToNow(date, { addSuffix: true });
  const preview = content.substring(0, 100);
  const characterCount = content.length;

  return (
    <div
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3 animate-in fade-in slide-in-from-bottom-2 duration-300`}
    >
      <div
        className={`max-w-2xl rounded-lg ${
          isOwn
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
        }`}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-left px-4 py-2 hover:opacity-80 transition-opacity flex items-center justify-between"
        >
          <div className="flex-1">
            <p className="text-sm font-medium">Secure Note</p>
            <p className="text-xs mt-1 opacity-75">
              {characterCount} characters
            </p>
          </div>
          <ChevronDown
            size={16}
            className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>

        {isExpanded && (
          <div className="border-t border-opacity-20 border-current">
            <ScrollArea className="max-h-64 w-full">
              <div className="px-4 py-3">
                <p className="text-sm whitespace-pre-wrap break-words">
                  {content}
                </p>
              </div>
            </ScrollArea>
          </div>
        )}

        {!isExpanded && (
          <div className="px-4 py-2 border-t border-opacity-20 border-current">
            <p className="text-xs opacity-75">
              {preview}
              {content.length > 100 ? '...' : ''}
            </p>
          </div>
        )}

        <div
          className={`px-4 py-1 text-xs ${
            isOwn
              ? 'text-blue-100 dark:text-blue-200'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {timeAgo}
        </div>
      </div>
    </div>
  );
}
