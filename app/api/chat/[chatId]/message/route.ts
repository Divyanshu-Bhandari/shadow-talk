export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { storeMessage, getChatById } from "@/lib/chat-utils";
import { checkRateLimit, getRateLimitKey, getClientIp } from "@/lib/rate-limit";

export async function POST(
  request: NextRequest,
  { params }: { params: { chatId: string } },
) {
  try {
    const { chatId } = params;
    const ip = getClientIp(request);
    const rateLimitKey = getRateLimitKey(ip, `message-${chatId}`);

    if (!checkRateLimit(rateLimitKey, 30, 60_000)) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 },
      );
    }

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

    const { content } = await request.json();

    if (!content || typeof content !== "string" || content.length > 20000) {
      return NextResponse.json({ error: "Invalid content" }, { status: 400 });
    }

    const message = await storeMessage(chatId, content);

    return NextResponse.json({ id: message.id }, { status: 201 });
  } catch (error) {
    console.error("[SEND_MESSAGE_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
