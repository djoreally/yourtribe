import { NextResponse } from "next/server";
import { z } from "zod";

const uploadRequestSchema = z.object({
  tenantSlug: z.string().min(2).max(100),
  fileName: z.string().min(1).max(255),
  contentType: z.enum(["video/mp4", "video/quicktime", "image/jpeg", "image/png"]),
  sizeBytes: z.number().int().positive().max(100 * 1024 * 1024),
});

/**
 * Storage is intentionally abstracted. Connect S3, Supabase Storage, or Vercel
 * Blob here; the browser should only ever receive a short-lived upload URL.
 */
export async function POST(request: Request) {
  const parsed = uploadRequestSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid upload request.", details: parsed.error.flatten() }, { status: 422 });

  if (!process.env.STORAGE_UPLOAD_ENDPOINT) {
    return NextResponse.json({
      error: "Media storage is not configured.",
      code: "STORAGE_NOT_CONFIGURED",
      guidance: "Set STORAGE_UPLOAD_ENDPOINT and implement the provider-specific signing operation before enabling production uploads.",
    }, { status: 503 });
  }

  // The provider signing logic belongs behind STORAGE_UPLOAD_ENDPOINT. This
  // route remains the stable API contract used by the patron web portal.
  return NextResponse.json({
    error: "The configured storage signer has not been implemented in this deployment.",
    code: "STORAGE_SIGNER_PENDING",
  }, { status: 501 });
}
