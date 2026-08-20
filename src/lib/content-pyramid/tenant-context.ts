import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export class TenantAccessError extends Error {
  constructor(message = "You do not have access to this tenant.") {
    super(message);
    this.name = "TenantAccessError";
  }
}

/**
 * Finds the tenant membership for the authenticated user. Every manager route
 * calls this before reading or mutating a media asset, which enforces the same
 * tenant boundary on every query as well as at the route edge.
 */
export async function getCurrentTenantContext() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new TenantAccessError("Please sign in to continue.");

  const member = await prisma.tenantMember.findFirst({
    where: { userId: session.user.id },
    include: { tenant: true },
    orderBy: { createdAt: "asc" },
  });

  if (!member) throw new TenantAccessError("No business workspace is available for this account.");
  return { user: session.user, member, tenant: member.tenant };
}

export async function assertAssetInCurrentTenant(assetId: string) {
  const { tenant, ...context } = await getCurrentTenantContext();
  const asset = await prisma.mediaAsset.findFirst({ where: { id: assetId, tenantId: tenant.id } });
  if (!asset) throw new TenantAccessError("This submission does not exist in your workspace.");
  return { ...context, tenant, asset };
}
