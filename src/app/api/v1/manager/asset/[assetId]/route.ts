import { NextResponse } from "next/server";
import { z } from "zod";
import { TenantAccessError, assertAssetInCurrentTenant } from "@/lib/content-pyramid/tenant-context";
import { prisma } from "@/lib/prisma";

const updateAssetSchema = z.object({
  action: z.enum(["approve", "reject", "schedule", "edit"]),
  caption: z.string().trim().max(500).optional(),
  scheduledFor: z.string().datetime().optional(),
  rejectionReason: z.string().trim().max(500).optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ assetId: string }> }) {
  try {
    const { assetId } = await params;
    const parsed = updateAssetSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid moderation request.", details: parsed.error.flatten() }, { status: 422 });

    const { asset } = await assertAssetInCurrentTenant(assetId);
    const data = parsed.data;
    const update = data.action === "approve"
      ? { status: "APPROVED" as const, rejectionReason: null, scheduledFor: null }
      : data.action === "reject"
        ? { status: "REJECTED" as const, rejectionReason: data.rejectionReason ?? "Rejected by manager", scheduledFor: null }
        : data.action === "schedule"
          ? { status: "SCHEDULED" as const, scheduledFor: new Date(data.scheduledFor ?? "") }
          : { patronCaption: data.caption };

    if (data.action === "schedule" && Number.isNaN((update as { scheduledFor?: Date }).scheduledFor?.getTime())) {
      return NextResponse.json({ error: "A valid UTC schedule time is required." }, { status: 422 });
    }

    const updatedAsset = await prisma.mediaAsset.update({ where: { id: asset.id }, data: update });
    return NextResponse.json({ asset: updatedAsset });
  } catch (error) {
    if (error instanceof TenantAccessError) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ error: "Unable to update this submission." }, { status: 500 });
  }
}
