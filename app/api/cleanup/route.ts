export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { cleanupExpiredChats } from "@/lib/chat-utils";

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.CLEANUP_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: "Server misconfigured" },
        { status: 500 },
      );
    }

    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await cleanupExpiredChats();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CLEANUP_ERROR]", error);
    return NextResponse.json({ error: "Cleanup failed" }, { status: 500 });
  }
}
