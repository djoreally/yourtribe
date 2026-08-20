import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowUpRight, Bell, ChevronDown, CirclePlus, ExternalLink, Grid2X2, LayoutDashboard, Link2, Settings2, Sparkles, UsersRound } from "lucide-react";
import { AccountMenu } from "@/components/auth/AccountMenu";
import { ManagerQueue } from "@/components/content-pyramid/ManagerQueue";
import { auth } from "@/lib/auth";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Review queue", icon: Grid2X2, active: false },
  { label: "Connections", icon: Link2, active: false },
  { label: "Collective", icon: UsersRound, active: false },
  { label: "Settings", icon: Settings2, active: false },
];

const connections = [
  { name: "Instagram", handle: "@amblerbrewing", tone: "bg-[#fbe8f0] text-[#ae2c67]", initial: "IG" },
  { name: "TikTok", handle: "@amblerbrewing", tone: "bg-[#e8f8f9] text-[#087e89]", initial: "TT" },
  { name: "Google Business", handle: "Ambler, PA", tone: "bg-[#fff0df] text-[#a75b1f]", initial: "GB" },
];

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/sign-in?callbackUrl=/dashboard");

  return (
    <main className="min-h-screen bg-[#f6f7f2]">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-[244px] shrink-0 border-r border-[#dfe7e1] bg-white px-4 py-5 lg:flex lg:flex-col">
          <Link href="/" className="flex items-center gap-2 px-2"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#17382f] font-[family-name:var(--font-display)] text-sm font-extrabold tracking-[-0.1em] text-[#d9ff5a]">CP</span><span className="font-[family-name:var(--font-display)] text-lg font-bold tracking-[-0.055em] text-[#17382f]">Content Pyramid</span></Link>
          <div className="mt-9 space-y-1">{navItems.map(({ label, icon: Icon, active }) => <button key={label} type="button" className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold transition ${active ? "bg-[#eaf0ec] text-[#17382f]" : "text-[#6c7f75] hover:bg-[#f3f6f3] hover:text-[#17382f]"}`}><Icon className="h-[18px] w-[18px]" />{label}</button>)}</div>
          <div className="mt-auto rounded-2xl bg-[#17382f] p-4 text-white"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#d9ff5a] text-[#17382f]"><Sparkles className="h-4 w-4" /></div><p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-[#b8cabf]">Your local network</p><p className="mt-1 font-[family-name:var(--font-display)] text-lg font-bold tracking-[-0.04em]">Ambler Local</p><p className="mt-2 text-xs leading-5 text-[#cfddd5]">Collective sharing is on. Your best moments can travel farther.</p><button type="button" className="mt-3 text-xs font-bold text-[#d9ff5a]">View collective <ArrowUpRight className="inline h-3 w-3" /></button></div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="flex min-h-[73px] items-center justify-between border-b border-[#dfe7e1] bg-white px-4 sm:px-6 lg:px-9"><div className="flex items-center gap-3 lg:hidden"><Link href="/" className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#17382f] font-[family-name:var(--font-display)] text-sm font-extrabold tracking-[-0.1em] text-[#d9ff5a]">CP</Link><span className="font-[family-name:var(--font-display)] text-lg font-bold tracking-[-0.055em] text-[#17382f]">Content Pyramid</span></div><button type="button" className="hidden items-center gap-2 rounded-xl border border-[#dce5de] px-3 py-2 text-sm font-bold text-[#254d42] lg:flex">Ambler Brewing Co. <ChevronDown className="h-4 w-4" /></button><div className="ml-auto flex items-center gap-3"><Link href="/portal/ambler-brewing" target="_blank" className="hidden items-center gap-2 rounded-xl border border-[#dce5de] px-3 py-2 text-xs font-bold text-[#486158] hover:bg-[#f3f6f3] sm:flex">View upload portal <ExternalLink className="h-3.5 w-3.5" /></Link><button type="button" aria-label="Notifications" className="relative rounded-xl p-2 text-[#50645a] hover:bg-[#f2f5f2]"><Bell className="h-5 w-5" /><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#d9ff5a] ring-2 ring-white" /></button><AccountMenu /></div></header>

          <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-9 lg:py-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6a7d74]">Tuesday, August 20</p><h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-bold tracking-[-0.065em] text-[#17382f] sm:text-5xl">Your content, in motion.</h1><p className="mt-3 max-w-xl text-base leading-6 text-[#5e7067]">Approve standout moments from your community and send them to the channels that matter.</p></div><button type="button" className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#17382f] px-4 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#254d42] sm:self-auto"><CirclePlus className="h-4 w-4 text-[#d9ff5a]" /> Create post</button></div>

            <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><div className="rounded-2xl border border-[#dde6df] bg-white p-5"><p className="text-xs font-bold uppercase tracking-[0.13em] text-[#718379]">Pending review</p><p className="mt-3 font-[family-name:var(--font-display)] text-4xl font-bold tracking-[-0.07em] text-[#17382f]">03</p><p className="mt-2 text-xs font-semibold text-[#63766c]">2 received in the last hour</p></div><div className="rounded-2xl border border-[#dde6df] bg-white p-5"><p className="text-xs font-bold uppercase tracking-[0.13em] text-[#718379]">Published this month</p><p className="mt-3 font-[family-name:var(--font-display)] text-4xl font-bold tracking-[-0.07em] text-[#17382f]">42</p><p className="mt-2 text-xs font-semibold text-[#3e7d52]">↑ 18% vs. last month</p></div><div className="rounded-2xl border border-[#dde6df] bg-white p-5"><p className="text-xs font-bold uppercase tracking-[0.13em] text-[#718379]">Community reach</p><p className="mt-3 font-[family-name:var(--font-display)] text-4xl font-bold tracking-[-0.07em] text-[#17382f]">18.4k</p><p className="mt-2 text-xs font-semibold text-[#63766c]">Across connected channels</p></div><div className="rounded-2xl border border-[#dde6df] bg-[#17382f] p-5 text-white"><p className="text-xs font-bold uppercase tracking-[0.13em] text-[#b7c8be]">Collective features</p><p className="mt-3 font-[family-name:var(--font-display)] text-4xl font-bold tracking-[-0.07em] text-[#d9ff5a]">06</p><p className="mt-2 text-xs font-semibold text-[#d6e3dc]">Your posts shared locally</p></div></section>

            <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_280px]"><ManagerQueue /><aside className="space-y-5"><section className="rounded-[1.6rem] border border-[#dde6df] bg-white p-5"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.13em] text-[#718379]">Social channels</p><h2 className="mt-1 font-[family-name:var(--font-display)] text-xl font-bold tracking-[-0.045em] text-[#17382f]">Connected & ready</h2></div><Link href="/dashboard" className="text-xs font-bold text-[#25503f] hover:underline">Manage</Link></div><div className="mt-5 space-y-3">{connections.map((connection) => <div key={connection.name} className="flex items-center gap-3"><span className={`flex h-9 w-9 items-center justify-center rounded-xl text-[10px] font-extrabold ${connection.tone}`}>{connection.initial}</span><div className="min-w-0"><p className="text-sm font-bold text-[#28463b]">{connection.name}</p><p className="truncate text-xs text-[#778980]">{connection.handle}</p></div><span className="ml-auto h-2 w-2 rounded-full bg-[#84d84c]" /></div>)}</div><button type="button" className="mt-5 w-full rounded-xl border border-dashed border-[#cbd7cf] px-3 py-2.5 text-xs font-bold text-[#5e7268] hover:bg-[#f4f7f4]">+ Connect another channel</button></section><section className="overflow-hidden rounded-[1.6rem] bg-[#e9f0eb] p-5"><p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-[#476157]"><Sparkles className="h-3.5 w-3.5" /> Collective signal</p><h2 className="mt-3 font-[family-name:var(--font-display)] text-xl font-bold leading-tight tracking-[-0.045em] text-[#17382f]">Two local brands featured your content this week.</h2><p className="mt-3 text-sm leading-5 text-[#587066]">Keep approving the moments your neighbors will want to share.</p><button type="button" className="mt-4 text-sm font-bold text-[#244e3d]">Open collective feed <ArrowUpRight className="inline h-3.5 w-3.5" /></button></section></aside></div>
          </div>
        </div>
      </div>
    </main>
  );
}
