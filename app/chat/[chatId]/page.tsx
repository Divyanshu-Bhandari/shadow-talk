"use client";

import Chat from "@/components/chat";

interface ChatPageProps {
  params: {
    chatId: string;
  };
}

export default function ChatPage({ params }: ChatPageProps) {
  return <Chat chatId={params.chatId} chatKey={params.chatId} />;
}
