export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getRateLimitKey, getClientIp } from "@/lib/rate-limit";

export async function GET(
  request: NextRequest,
  { params }: { params: { chatId: string } },
) {
  try {
    const { getChatById } = await import("@/lib/chat-utils");
    const { chatId } = params;
    const ip = getClientIp(request);
    const rateLimitKey = getRateLimitKey(ip, `poll-${chatId}`);

    if (!checkRateLimit(rateLimitKey, 60, 60_000)) {
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

    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("[POLL_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to poll messages" },
      { status: 500 },
    );
  }
}
