import { NextResponse } from "next/server";
import { TenantAccessError, getCurrentTenantContext } from "@/lib/content-pyramid/tenant-context";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { tenant } = await getCurrentTenantContext();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const pageSize = Math.min(50, Math.max(1, Number(searchParams.get("pageSize") ?? 20)));
    const status = searchParams.get("status");

    const where = {
      tenantId: tenant.id,
      ...(status && ["PENDING", "APPROVED", "SCHEDULED", "REJECTED"].includes(status) ? { status: status as "PENDING" | "APPROVED" | "SCHEDULED" | "REJECTED" } : {}),
    };

    const [assets, total] = await Promise.all([
      prisma.mediaAsset.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize, include: { broadcasts: { orderBy: { createdAt: "desc" }, take: 1 } } }),
      prisma.mediaAsset.count({ where }),
    ]);

    return NextResponse.json({ assets, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } });
  } catch (error) {
    if (error instanceof TenantAccessError) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ error: "Unable to load the review queue." }, { status: 500 });
  }
}
