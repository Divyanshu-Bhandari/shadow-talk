import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

const ROOM_LIFETIME_MS = 15 * 60 * 1000;

// Simple in-memory rate limit (dev-safe)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 30;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) ?? [];

  const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);
  if (recent.length >= RATE_LIMIT_MAX) return false;

  recent.push(now);
  rateLimitMap.set(ip, recent);
  return true;
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const roomId = nanoid(10);
    const expiresAt = new Date(Date.now() + ROOM_LIFETIME_MS).toISOString();

    return NextResponse.json(
      {
        roomId,
        expiresAt,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Create room error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}