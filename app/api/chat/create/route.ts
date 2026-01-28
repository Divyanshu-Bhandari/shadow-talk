export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function POST() {
  try {
    const { createChatSession } = await import("@/lib/chat-utils");

    const chat = await createChatSession();

    // ✅ return ONLY the short code
    return NextResponse.json({ code: chat.key }, { status: 201 });
  } catch (error) {
    console.error("Error creating chat:", error);
    return NextResponse.json(
      { error: "Failed to create chat" },
      { status: 500 },
    );
  }
}
