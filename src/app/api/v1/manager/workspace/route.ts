import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function createSlug(value: string) {
  const base = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 42) || "my-workspace";

  return `${base}-${crypto.randomUUID().slice(0, 8)}`;
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Authentication is required." }, { status: 401 });
  }

  const body = await request.json().catch(() => null) as { workspaceName?: unknown } | null;
  const workspaceName = typeof body?.workspaceName === "string" ? body.workspaceName.trim() : "";

  if (workspaceName.length < 2 || workspaceName.length > 80) {
    return NextResponse.json(
      { error: "Workspace name must be between 2 and 80 characters." },
      { status: 422 },
    );
  }

  const existingMembership = await prisma.tenantMember.findFirst({
    where: { userId: session.user.id },
    include: { tenant: true },
    orderBy: { createdAt: "asc" },
  });

  if (existingMembership) {
    return NextResponse.json({ tenant: existingMembership.tenant, created: false });
  }

  const organizationId = crypto.randomUUID();
  const tenant = await prisma.$transaction(async (tx) => {
    const existing = await tx.tenantMember.findFirst({
      where: { userId: session.user.id },
      include: { tenant: true },
      orderBy: { createdAt: "asc" },
    });

    if (existing) return { tenant: existing.tenant, created: false };

    const organization = await tx.organization.create({
      data: {
        id: organizationId,
        name: workspaceName,
        slug: createSlug(workspaceName),
      },
    });

    const createdTenant = await tx.tenant.create({
      data: {
        organizationId: organization.id,
        name: workspaceName,
        slug: createSlug(workspaceName),
      },
    });

    await Promise.all([
      tx.member.create({
        data: {
          id: crypto.randomUUID(),
          organizationId: organization.id,
          userId: session.user.id,
          role: "owner",
        },
      }),
      tx.tenantMember.create({
        data: {
          tenantId: createdTenant.id,
          userId: session.user.id,
          role: "OWNER",
        },
      }),
    ]);

    return { tenant: createdTenant, created: true };
  });

  return NextResponse.json(tenant, { status: tenant.created ? 201 : 200 });
}
