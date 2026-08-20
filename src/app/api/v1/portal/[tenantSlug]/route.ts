import { NextResponse } from "next/server";
import { demoTenant } from "@/lib/content-pyramid/demo-data";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: Promise<{ tenantSlug: string }> }) {
  const { tenantSlug } = await params;

  // Allow the prototype to remain explorable before DATABASE_URL is configured.
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ tenant: { ...demoTenant, slug: tenantSlug || demoTenant.slug }, mode: "demo" });
  }

  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
    select: {
      id: true,
      name: true,
      slug: true,
      logoUrl: true,
      primaryColor: true,
      secondaryColor: true,
      welcomeMessage: true,
      uploadLimitMb: true,
      uploadLimitSeconds: true,
      collectiveEnabled: true,
      collectiveName: true,
    },
  });

  if (!tenant) return NextResponse.json({ error: "Tenant not found." }, { status: 404 });
  return NextResponse.json({ tenant, mode: "live" });
}
