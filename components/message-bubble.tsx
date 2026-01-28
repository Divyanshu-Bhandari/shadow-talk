"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface MessageBubbleProps {
  content: string;
  isOwn: boolean;
  timestamp: string;
}

export default function MessageBubble({
  content,
  isOwn,
  timestamp,
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copy failed:", error);
      toast.error("Failed to copy");
    }
  };

  const time = new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex gap-2 mb-4 ${isOwn ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-xs lg:max-w-md group relative ${
          isOwn
            ? "bg-blue-600 text-white rounded-l-lg rounded-tr-lg"
            : "bg-slate-700 text-slate-100 rounded-r-lg rounded-tl-lg"
        } px-4 py-2`}
      >
        <p className="break-words text-sm leading-relaxed">{content}</p>
        <div className="flex items-center justify-between gap-2 mt-1">
          <span className="text-xs opacity-70">{time}</span>
          <button
            onClick={handleCopy}
            className="opacity-80 group-hover:opacity-100 transition-opacity p-1 hover:bg-black/20 rounded"
            title="Copy message"
          >
            {copied ? (
              <Check className="w-3 h-3" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
