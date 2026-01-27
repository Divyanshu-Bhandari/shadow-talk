export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function DELETE() {
  return NextResponse.json({ success: true });
}
