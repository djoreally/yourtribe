"use client";

import Image from "next/image";
import { CalendarClock, Check, ChevronRight, Film, MoreHorizontal, Play, Send, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { DemoAsset, DemoPlatform, demoAssets, platformLabels, platformShortLabels } from "@/lib/content-pyramid/demo-data";

const platformStyles: Record<DemoPlatform, string> = {
  instagram: "bg-[#fce8f0] text-[#a92b65] ring-[#f8d7e5]",
  tiktok: "bg-[#e7f8fa] text-[#087d89] ring-[#cef0f3]",
  facebook: "bg-[#e8efff] text-[#3158a9] ring-[#d9e4ff]",
  gmb: "bg-[#fff1df] text-[#a65818] ring-[#ffe4c3]",
  youtube: "bg-[#ffe9e7] text-[#b6322d] ring-[#ffd6d3]",
};

function PlatformToggle({ platform, selected, onClick }: { platform: DemoPlatform; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={selected} className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1.5 text-xs font-bold ring-1 transition ${selected ? platformStyles[platform] : "bg-white text-[#7b8c84] ring-[#dbe4de] hover:bg-[#f4f7f4]"}`}>
      <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-extrabold ${selected ? "bg-white/70" : "bg-[#eff3f0]"}`}>{platformShortLabels[platform]}</span>
      <span>{platformLabels[platform]}</span>
      {selected && <Check className="h-3.5 w-3.5" />}
    </button>
  );
}

export function ManagerQueue() {
  const [assets, setAssets] = useState(demoAssets);
  const [selectedByAsset, setSelectedByAsset] = useState<Record<string, DemoPlatform[]>>(() => Object.fromEntries(demoAssets.map((asset) => [asset.id, asset.selectedPlatforms])));
  const [notice, setNotice] = useState<string | null>(null);

  const pendingCount = useMemo(() => assets.filter((asset) => asset.status === "pending").length, [assets]);

  function togglePlatform(assetId: string, platform: DemoPlatform) {
    setSelectedByAsset((current) => {
      const selected = current[assetId] ?? [];
      return { ...current, [assetId]: selected.includes(platform) ? selected.filter((item) => item !== platform) : [...selected, platform] };
    });
  }

  function updateAsset(assetId: string, nextStatus: DemoAsset["status"], nextNotice: string) {
    setAssets((current) => current.map((asset) => asset.id === assetId ? { ...asset, status: nextStatus } : asset));
    setNotice(nextNotice);
    window.setTimeout(() => setNotice(null), 4200);
  }

  return (
    <section className="rounded-[1.7rem] border border-[#dde6df] bg-white shadow-[0_18px_45px_rgba(18,45,38,0.07)]">
      <div className="flex flex-col gap-4 border-b border-[#e7ede9] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6a7d74]">Incoming moments</p><h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-bold tracking-[-0.055em] text-[#17382f]">Review queue</h2></div>
        <div className="inline-flex items-center self-start rounded-full bg-[#f0f4ef] px-3 py-2 text-sm font-bold text-[#254d42]"><span className="mr-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#17382f] px-1 text-[11px] text-[#d9ff5a]">{pendingCount}</span> pending</div>
      </div>

      {notice && <div role="status" className="mx-5 mt-5 flex items-center gap-2 rounded-xl bg-[#edffe4] px-3.5 py-3 text-sm font-semibold text-[#25503d] sm:mx-6"><Check className="h-4 w-4" /> {notice}</div>}

      <div className="divide-y divide-[#e7ede9]">
        {assets.map((asset) => {
          const isPending = asset.status === "pending";
          const platforms = selectedByAsset[asset.id] ?? [];
          return (
            <article key={asset.id} className="p-5 sm:p-6">
              <div className="grid gap-5 lg:grid-cols-[180px_1fr]">
                <div className="relative aspect-[4/4.6] overflow-hidden rounded-2xl bg-[#18382f] shadow-sm lg:aspect-[4/5]">
                  <Image src={asset.image} alt={`Submission from ${asset.patronHandle}`} fill sizes="(max-width: 1024px) 100vw, 180px" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/50 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-white backdrop-blur-sm">{asset.mediaType === "video" ? <Film className="h-3 w-3" /> : <Play className="h-3 w-3" />} {asset.mediaType}</div>
                  <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#17382f]">{asset.status}</span>
                </div>

                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-4"><div><div className="flex flex-wrap items-center gap-x-2 gap-y-1"><p className="font-[family-name:var(--font-display)] text-xl font-bold tracking-[-0.04em] text-[#17382f]">{asset.patronHandle}</p><span className="text-xs text-[#809187]">· {asset.createdAt}</span></div><p className="mt-2 max-w-2xl text-sm leading-6 text-[#52665c]">“{asset.caption}”</p></div><button type="button" aria-label="More asset options" className="rounded-lg p-1.5 text-[#829289] transition hover:bg-[#eef3ef] hover:text-[#17382f]"><MoreHorizontal className="h-5 w-5" /></button></div>

                  <div className="mt-5"><p className="mb-2.5 text-xs font-bold uppercase tracking-[0.12em] text-[#687c72]">Target channels</p><div className="flex flex-wrap gap-2">{(["instagram", "tiktok", "facebook", "gmb", "youtube"] as DemoPlatform[]).map((platform) => <PlatformToggle key={platform} platform={platform} selected={platforms.includes(platform)} onClick={() => togglePlatform(asset.id, platform)} />)}</div></div>

                  {isPending ? <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap"><button type="button" onClick={() => updateAsset(asset.id, "rejected", "Submission rejected and removed from the live queue.")} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#dce4de] px-3.5 py-2.5 text-xs font-bold text-[#5e7067] transition hover:border-[#cfdad2] hover:bg-[#f4f7f4]"><Trash2 className="h-3.5 w-3.5" /> Reject</button><button type="button" onClick={() => updateAsset(asset.id, "scheduled", "Scheduled for the next peak-time publishing slot.")} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#dce4de] px-3.5 py-2.5 text-xs font-bold text-[#355247] transition hover:border-[#b7c8bd] hover:bg-[#f4f7f4]"><CalendarClock className="h-3.5 w-3.5" /> Schedule</button><button type="button" disabled={platforms.length === 0} onClick={() => updateAsset(asset.id, "approved", `Approved for ${platforms.length} channel${platforms.length === 1 ? "" : "s"}. Broadcast job created.`)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#17382f] px-4 py-2.5 text-xs font-extrabold uppercase tracking-[0.07em] text-white transition hover:bg-[#254d42] disabled:cursor-not-allowed disabled:opacity-40"><Send className="h-3.5 w-3.5 text-[#d9ff5a]" /> Approve & broadcast</button></div> : <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#f2f6f3] px-3 py-2 text-xs font-semibold text-[#657970]">{asset.status === "scheduled" ? <CalendarClock className="h-3.5 w-3.5" /> : asset.status === "approved" ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />} {asset.status === "scheduled" ? "Waiting for scheduled publishing" : asset.status === "approved" ? "Broadcast job in progress" : "Removed from review"}</div>}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <button type="button" className="flex w-full items-center justify-center gap-2 border-t border-[#e7ede9] px-5 py-4 text-sm font-bold text-[#345247] transition hover:bg-[#f7faf7]">See all submissions <ChevronRight className="h-4 w-4" /></button>
    </section>
  );
}
