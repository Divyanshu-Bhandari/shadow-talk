export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

export async function POST(
  _request: NextRequest,
  { params }: { params: { chatId: string } }, // chatId == key
) {
  try {
    const key = params.chatId;

    const { getChatByKey } = await import("@/lib/chat-utils");

    const chat = await getChatByKey(key);
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
