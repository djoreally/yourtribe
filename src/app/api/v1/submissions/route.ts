import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const submissionSchema = z.object({
  tenantSlug: z.string().min(2).max(100),
  rawMediaUrl: z.string().url(),
  mediaType: z.enum(["image", "video"]),
  patronHandle: z.string().trim().max(100).optional().nullable(),
  patronCaption: z.string().trim().max(500).optional().nullable(),
  rightsAgreed: z.literal(true),
});

export async function POST(request: Request) {
  const parsed = submissionSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission.", details: parsed.error.flatten() }, { status: 422 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ id: `demo-${crypto.randomUUID()}`, status: "pending", mode: "demo" }, { status: 201 });
  }

  const tenant = await prisma.tenant.findUnique({ where: { slug: parsed.data.tenantSlug }, select: { id: true } });
  if (!tenant) return NextResponse.json({ error: "Tenant not found." }, { status: 404 });

  const asset = await prisma.mediaAsset.create({
    data: {
      tenantId: tenant.id,
      rawMediaUrl: parsed.data.rawMediaUrl,
      mediaType: parsed.data.mediaType === "video" ? "VIDEO" : "IMAGE",
      patronHandle: parsed.data.patronHandle || null,
      patronCaption: parsed.data.patronCaption || null,
      rightsAgreed: true,
      rightsAgreedAt: new Date(),
    },
    select: { id: true, status: true, createdAt: true },
  });

  return NextResponse.json({ asset }, { status: 201 });
}
