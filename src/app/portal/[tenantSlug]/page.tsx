import Link from "next/link";
import { ArrowLeft, BadgeCheck, CirclePlay, Sparkles } from "lucide-react";
import { PortalUploader } from "@/components/content-pyramid/PortalUploader";
import { demoTenant } from "@/lib/content-pyramid/demo-data";

export const dynamic = "force-dynamic";

export default async function TenantPortalPage({ params }: { params: Promise<{ tenantSlug: string }> }) {
  const { tenantSlug } = await params;
  const tenant = { ...demoTenant, slug: tenantSlug || demoTenant.slug };

  return (
    <main className="min-h-screen bg-[#f6f7f2] px-4 py-5 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-md">
        <Link href="/" className="mb-7 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#60736a] transition hover:text-[#17382f]"><ArrowLeft className="h-4 w-4" /> Content Pyramid</Link>

        <header className="overflow-hidden rounded-[2rem] bg-[#17382f] p-6 text-white shadow-[0_24px_70px_rgba(18,45,38,0.2)]">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d9ff5a] font-[family-name:var(--font-display)] text-lg font-extrabold tracking-[-0.08em] text-[#17382f]">{tenant.logoInitials}</div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold tracking-[0.1em] text-white/90"><BadgeCheck className="h-3.5 w-3.5 text-[#d9ff5a]" /> OFFICIAL UPLOAD</span>
          </div>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.16em] text-[#b7c9bf]">You&apos;re sharing with</p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-bold leading-[0.96] tracking-[-0.065em] text-white">{tenant.name}</h1>
          <p className="mt-4 max-w-sm text-base leading-6 text-[#d9e5df]">{tenant.welcomeMessage}</p>
          {tenant.collectiveEnabled && <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#254d42] px-3 py-2 text-xs font-semibold text-[#e8f0eb]"><Sparkles className="h-4 w-4 text-[#d9ff5a]" /> Eligible for {tenant.collectiveName} features</div>}
        </header>

        <section className="mt-5 rounded-[2rem] bg-white p-5 shadow-[0_18px_50px_rgba(18,45,38,0.08)] sm:p-6">
          <div className="mb-6 flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#edf2ed] text-[#17382f]"><CirclePlay className="h-5 w-5" /></div>
            <div><h2 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-[-0.04em] text-[#17382f]">Show us the good stuff.</h2><p className="mt-1 text-sm leading-5 text-[#667a70]">Your clip may be featured on our official social channels.</p></div>
          </div>
          <PortalUploader tenant={tenant} />
        </section>

        <p className="px-4 pb-5 pt-6 text-center text-xs leading-5 text-[#76877f]">By sending your content, you confirm that you own it or have permission to share it. Need something removed? Contact {tenant.name} directly.</p>
      </div>
    </main>
  );
}
