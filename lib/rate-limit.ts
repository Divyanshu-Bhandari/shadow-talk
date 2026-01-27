import { NextRequest } from "next/server";

type Entry = {
  count: number;
  expiresAt: number;
};

const store = new Map<string, Entry>();

export function getClientIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
}

export function getRateLimitKey(ip: string, action: string) {
  return `${ip}:${action}`;
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.expiresAt < now) {
    store.set(key, {
      count: 1,
      expiresAt: now + windowMs,
    });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count++;
  return true;
}
