import { NextRequest, NextResponse } from "next/server";
import { getChatById } from "@/lib/chat-utils";

export async function POST(
  _request: NextRequest,
  { params }: { params: { chatId: string } },
) {
  try {
    const { chatId } = params;

    const chat = await getChatById(chatId);
    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    if (chat.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Chat session expired" },
        { status: 410 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[JOIN_CHAT_ERROR]", error);
    return NextResponse.json({ error: "Failed to join chat" }, { status: 500 });
  }
}
