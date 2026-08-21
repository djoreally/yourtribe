import { NextResponse } from "next/server";
import { getAuthEmailHealth } from "@/lib/auth-email";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export function GET() {
  const health = getAuthEmailHealth();
  const payload = process.env.NODE_ENV === "production"
    ? { provider: health.provider, configured: health.configured, requiredInProduction: health.requiredInProduction }
    : health;
  return NextResponse.json(payload, { status: health.configured ? 200 : 503 });
}
