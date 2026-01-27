"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Chat from "@/components/chat";

interface ChatPageProps {
  params: {
    chatId: string;
  };
}

export default function ChatPage({ params }: ChatPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatKey = searchParams.get("key");

  useEffect(() => {
    if (!chatKey) {
      router.replace("/");
    }
  }, [chatKey, router]);

  if (!chatKey) {
    return null; // prevent flicker
  }

  return <Chat chatId={params.chatId} chatKey={chatKey} />;
}
