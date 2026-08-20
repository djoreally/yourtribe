import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, CirclePlay, Layers3, QrCode, Send, ShieldCheck, Sparkles, Upload } from "lucide-react";

const steps = [
  { icon: QrCode, title: "Invite the moment", body: "Put a branded QR code anywhere your community gathers. No app, no account, no friction." },
  { icon: Upload, title: "Collect it beautifully", body: "Guests share video and photos through a portal that looks and feels like your brand." },
  { icon: Send, title: "Approve it everywhere", body: "One team review turns the best moments into on-brand posts across your connected channels." },
];

export default function HomePage() {
  return (
    <main className="overflow-hidden bg-[#f6f7f2]">
      <nav className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <Link href="/" className="flex items-center gap-2.5"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#17382f] font-[family-name:var(--font-display)] text-sm font-extrabold tracking-[-0.1em] text-[#d9ff5a]">CP</span><span className="font-[family-name:var(--font-display)] text-xl font-bold tracking-[-0.06em] text-[#17382f]">Content Pyramid</span></Link>
        <div className="flex items-center gap-3"><Link href="/portal/ambler-brewing" className="hidden text-sm font-bold text-[#4f655a] transition hover:text-[#17382f] sm:block">Try the upload portal</Link><Link href="/dashboard" className="rounded-xl bg-[#17382f] px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-[#254d42]">Open dashboard</Link></div>
      </nav>

      <section className="relative mx-auto max-w-[1280px] px-5 pb-16 pt-10 sm:px-8 sm:pt-16 lg:px-10 lg:pb-24">
        <div className="absolute -right-32 top-0 -z-0 h-80 w-80 rounded-full bg-[#d9ff5a]/30 blur-3xl" />
        <div className="relative grid items-center gap-12 lg:grid-cols-[1.04fr_0.96fr] lg:gap-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d2ddd5] bg-white/75 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.13em] text-[#476157]"><Sparkles className="h-3.5 w-3.5 text-[#4f7e33]" /> Community content, elevated</div>
            <h1 className="mt-7 max-w-3xl font-[family-name:var(--font-display)] text-5xl font-bold leading-[0.92] tracking-[-0.075em] text-[#17382f] sm:text-6xl lg:text-7xl">Your customers already create the story.</h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[#52675d]">Content Pyramid makes it easy to collect, review, and share the real moments that make your business worth talking about.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/portal/ambler-brewing" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#17382f] px-5 py-3.5 text-sm font-extrabold text-white shadow-[0_12px_25px_rgba(23,56,47,0.16)] transition hover:bg-[#254d42]">Explore the patron portal <ArrowRight className="h-4 w-4 text-[#d9ff5a]" /></Link><Link href="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#cbd8d0] bg-white px-5 py-3.5 text-sm font-extrabold text-[#28493d] transition hover:bg-[#eff4ef]"><CirclePlay className="h-4 w-4" /> See the manager view</Link></div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-[#5e7268]"><span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#4f8a2c]" /> No app to download</span><span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#4f8a2c]" /> Built for your brand</span><span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#4f8a2c]" /> One-tap distribution</span></div>
          </div>

          <div className="relative mx-auto w-full max-w-[500px]">
            <div className="absolute -left-12 top-12 hidden rounded-2xl bg-white px-4 py-3 shadow-[0_18px_45px_rgba(18,45,38,0.14)] sm:block"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#708278]">New submission</p><div className="mt-1.5 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#76cf47]" /><span className="text-xs font-bold text-[#254d42]">From @johnny_eats</span></div></div>
            <div className="relative overflow-hidden rounded-[2.4rem] bg-[#17382f] p-3 shadow-[0_32px_75px_rgba(17,49,40,0.28)]"><div className="relative aspect-[4/5] overflow-hidden rounded-[1.8rem]"><Image src="/content-pyramid/patio-moment.jpg" alt="Community moment shared at a local brewery" fill priority sizes="(max-width: 1024px) 90vw, 500px" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#0d241d]/90 via-[#0d241d]/5 to-transparent" /><div className="absolute inset-x-0 bottom-0 p-6 text-white"><div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] backdrop-blur-sm"><Upload className="h-3.5 w-3.5 text-[#d9ff5a]" /> Shared from the patio</div><p className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold leading-none tracking-[-0.05em]">The best marketing doesn&apos;t feel like marketing.</p><p className="mt-3 text-sm leading-5 text-white/80">It feels like a night worth remembering.</p></div></div></div>
            <div className="absolute -bottom-7 -right-6 flex items-center gap-3 rounded-2xl border border-[#d7e2db] bg-white p-3.5 shadow-[0_18px_45px_rgba(18,45,38,0.13)]"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#d9ff5a] text-[#17382f]"><Send className="h-4 w-4" /></span><span><span className="block text-[10px] font-bold uppercase tracking-[0.13em] text-[#76887e]">Ready to share</span><span className="mt-0.5 block text-xs font-extrabold text-[#254d42]">3 channels selected</span></span></div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#dce5df] bg-white"><div className="mx-auto grid max-w-[1280px] gap-5 px-5 py-14 sm:grid-cols-3 sm:px-8 lg:px-10">{steps.map(({ icon: Icon, title, body }, index) => <article key={title} className="relative rounded-2xl bg-[#f4f7f4] p-6"><span className="absolute right-5 top-5 font-[family-name:var(--font-display)] text-4xl font-bold tracking-[-0.07em] text-[#d6e2d9]">0{index + 1}</span><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#17382f] text-[#d9ff5a]"><Icon className="h-5 w-5" /></span><h2 className="mt-6 font-[family-name:var(--font-display)] text-2xl font-bold tracking-[-0.045em] text-[#17382f]">{title}</h2><p className="mt-3 max-w-sm text-sm leading-6 text-[#61756b]">{body}</p></article>)}</div></section>

      <section className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 lg:px-10"><div className="grid gap-10 rounded-[2.2rem] bg-[#17382f] px-6 py-10 text-white sm:px-10 lg:grid-cols-[1fr_auto] lg:items-center lg:px-14"><div><div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#b9cbbf]"><Layers3 className="h-4 w-4 text-[#d9ff5a]" /> Built for your local network</div><h2 className="mt-4 max-w-2xl font-[family-name:var(--font-display)] text-4xl font-bold leading-[0.98] tracking-[-0.065em] text-white">Turn a single great moment into a community signal.</h2><p className="mt-4 max-w-xl text-base leading-7 text-[#cad9d1]">Opt into a collective when you&apos;re ready. Your approved local content can be discovered, featured, and shared by trusted partners in your neighborhood.</p></div><div className="flex flex-col gap-3"><Link href="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d9ff5a] px-5 py-3.5 text-sm font-extrabold text-[#17382f] transition hover:bg-[#c8f34b]">Launch your workspace <ArrowRight className="h-4 w-4" /></Link><span className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-[#b9cbbf]"><ShieldCheck className="h-4 w-4" /> Permissioned, brand-safe sharing</span></div></div></section>

      <footer className="border-t border-[#dce5df] px-5 py-8 sm:px-8 lg:px-10"><div className="mx-auto flex max-w-[1280px] flex-col gap-4 text-xs font-semibold text-[#72847a] sm:flex-row sm:items-center sm:justify-between"><span>© 2026 Content Pyramid. Community content, made useful.</span><span>White-label portals · Team review · Multi-channel distribution</span></div></footer>
    </main>
  );
}
