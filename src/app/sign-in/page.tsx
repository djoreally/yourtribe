"use client";

import Link from "next/link";
import { ArrowRight, KeyRound, LoaderCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { signIn } from "@/lib/auth-client";

function SignInContent() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const callbackURL = searchParams.get("callbackUrl") || "/dashboard";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const { error: signInError } = await signIn.email({
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      callbackURL,
    });
    setIsSubmitting(false);
    if (signInError) setError(signInError.message ?? "We could not sign you in. Please try again.");
  }

  return (
    <main className="grid min-h-screen bg-[#f6f7f2] lg:grid-cols-[1.08fr_0.92fr]">
      <section className="hidden bg-[#17382f] p-12 text-white lg:flex lg:flex-col lg:justify-between"><Link href="/" className="flex items-center gap-2.5"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d9ff5a] font-[family-name:var(--font-display)] text-sm font-extrabold tracking-[-0.1em] text-[#17382f]">CP</span><span className="font-[family-name:var(--font-display)] text-xl font-bold tracking-[-0.06em]">Content Pyramid</span></Link><div className="max-w-md"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b9cbbf]">Manager workspace</p><h1 className="mt-4 font-[family-name:var(--font-display)] text-6xl font-bold leading-[0.92] tracking-[-0.075em] text-white">Keep the best moments moving.</h1><p className="mt-6 text-lg leading-8 text-[#cfddd5]">Review community uploads, protect your brand, and distribute with confidence.</p></div><p className="text-sm font-semibold text-[#b9cbbf]">Your team owns the story. We make the workflow simple.</p></section>
      <section className="flex items-center justify-center p-5 sm:p-8"><div className="w-full max-w-md"><Link href="/" className="mb-12 inline-flex items-center gap-2 text-sm font-bold text-[#5b7066] transition hover:text-[#17382f] lg:hidden"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#17382f] font-[family-name:var(--font-display)] text-[11px] font-extrabold tracking-[-0.1em] text-[#d9ff5a]">CP</span> Content Pyramid</Link><div className="rounded-[2rem] border border-[#dce5df] bg-white p-6 shadow-[0_20px_60px_rgba(18,45,38,0.09)] sm:p-8"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf0ec] text-[#17382f]"><KeyRound className="h-5 w-5" /></div><h2 className="mt-6 font-[family-name:var(--font-display)] text-3xl font-bold tracking-[-0.055em] text-[#17382f]">Welcome back.</h2><p className="mt-2 text-sm leading-6 text-[#61746a]">Sign in to review and publish content for your business.</p><form onSubmit={handleSubmit} className="mt-7 space-y-4"><div><label htmlFor="email" className="mb-2 block text-sm font-bold text-[#27483c]">Email address</label><input id="email" name="email" type="email" autoComplete="email" required placeholder="you@business.com" className="w-full rounded-xl border border-[#ccd8d1] px-4 py-3 text-[#17382f] outline-none transition placeholder:text-[#9aa9a1] focus:border-[#17382f] focus:ring-4 focus:ring-[#d9ff5a]/40" /></div><div><label htmlFor="password" className="mb-2 block text-sm font-bold text-[#27483c]">Password</label><input id="password" name="password" type="password" autoComplete="current-password" required minLength={8} placeholder="••••••••" className="w-full rounded-xl border border-[#ccd8d1] px-4 py-3 text-[#17382f] outline-none transition placeholder:text-[#9aa9a1] focus:border-[#17382f] focus:ring-4 focus:ring-[#d9ff5a]/40" /></div>{error && <p role="alert" className="rounded-xl bg-[#fff0ed] px-3 py-2.5 text-sm font-semibold text-[#9d2f1c]">{error}</p>}<button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#17382f] px-4 py-3.5 text-sm font-extrabold text-white transition hover:bg-[#254d42] disabled:cursor-wait disabled:opacity-70">{isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <>Sign in <ArrowRight className="h-4 w-4 text-[#d9ff5a]" /></>}</button></form><p className="mt-6 text-center text-sm text-[#6a7d73]">New to Content Pyramid? <Link href="/sign-up" className="font-bold text-[#244e3d] hover:underline">Create an account</Link></p></div></div></section>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#f6f7f2]" />}>
      <SignInContent />
    </Suspense>
  );
}
