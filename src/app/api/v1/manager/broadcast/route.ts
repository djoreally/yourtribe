import { NextResponse } from "next/server";
import { z } from "zod";
import { TenantAccessError, assertAssetInCurrentTenant } from "@/lib/content-pyramid/tenant-context";
import { prisma } from "@/lib/prisma";

const platformMap = {
  instagram: "INSTAGRAM",
  tiktok: "TIKTOK",
  facebook: "FACEBOOK",
  gmb: "GMB",
  youtube: "YOUTUBE",
} as const;

const broadcastSchema = z.object({
  assetId: z.string().min(1),
  platforms: z.array(z.enum(["instagram", "tiktok", "facebook", "gmb", "youtube"])).min(1),
  caption: z.string().trim().max(2200).optional(),
  scheduleDate: z.string().datetime().optional(),
});

export async function POST(request: Request) {
  try {
    const parsed = broadcastSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Select at least one valid destination channel.", details: parsed.error.flatten() }, { status: 422 });

    const { asset, tenant } = await assertAssetInCurrentTenant(parsed.data.assetId);
    const mediaUrl = asset.processedMediaUrl ?? asset.rawMediaUrl;
    const platforms = parsed.data.platforms.map((platform) => platformMap[platform]);

    const log = await prisma.broadcastLog.create({
      data: { assetId: asset.id, tenantId: tenant.id, platformsTargeted: platforms, status: "PROCESSING" },
    });

    await prisma.mediaAsset.update({ where: { id: asset.id }, data: { status: parsed.data.scheduleDate ? "SCHEDULED" : "APPROVED", scheduledFor: parsed.data.scheduleDate ? new Date(parsed.data.scheduleDate) : null } });

    if (!process.env.AYRSHARE_API_KEY || !tenant.ayrshareProfileKey) {
      return NextResponse.json({
        broadcast: log,
        queued: true,
        mode: "pending-integration",
        message: "Broadcast log created. Add AYRSHARE_API_KEY and the tenant profile key to enable live distribution.",
      }, { status: 202 });
    }

    const response = await fetch("https://app.ayrshare.com/api/post", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.AYRSHARE_API_KEY}`,
        "Profile-Key": tenant.ayrshareProfileKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        post: parsed.data.caption ?? asset.patronCaption ?? "Shared from our community.",
        mediaUrls: [mediaUrl],
        platforms: parsed.data.platforms,
        ...(parsed.data.scheduleDate ? { scheduleDate: parsed.data.scheduleDate } : {}),
      }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      await prisma.broadcastLog.update({ where: { id: log.id }, data: { status: "FAILED", errorLog: JSON.stringify(payload).slice(0, 2000) } });
      return NextResponse.json({ error: "The distribution provider rejected this post.", provider: payload }, { status: 502 });
    }

    const broadcast = await prisma.broadcastLog.update({ where: { id: log.id }, data: { ayrsharePostId: payload.id ?? null, status: "SUCCESS", publishedAt: new Date() } });
    return NextResponse.json({ broadcast, provider: payload });
  } catch (error) {
    if (error instanceof TenantAccessError) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ error: "Unable to create the broadcast job." }, { status: 500 });
  }
}
