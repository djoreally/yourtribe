"use client";

import Link from "next/link";
import { ArrowLeft, MailCheck, Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { requestPasswordReset } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const email = String(new FormData(event.currentTarget).get("email") ?? "").trim();

    try {
      const healthResponse = await fetch("/api/health/auth-email", { cache: "no-store" });
      if (!healthResponse.ok) {
        throw new Error("Password recovery is temporarily unavailable. Please contact your workspace administrator.");
      }

      const { error: resetError } = await requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (resetError) throw new Error(resetError.message ?? "We could not start password recovery. Please try again.");
      setSent(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "We could not start password recovery. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f7f2] p-5 sm:p-8">
      <div className="w-full max-w-md">
        <Link href="/sign-in" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[#5b7066] transition hover:text-[#17382f]"><ArrowLeft className="h-4 w-4" />Back to sign in</Link>
        <section className="rounded-[2rem] border border-[#dce5df] bg-white p-6 shadow-[0_20px_60px_rgba(18,45,38,0.09)] sm:p-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d9ff5a] text-[#17382f]"><MailCheck className="h-5 w-5" /></div>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-3xl font-bold tracking-[-0.055em] text-[#17382f]">Reset your password.</h1>
          <p className="mt-2 text-sm leading-6 text-[#61746a]">Enter the email for your Northstar manager account. If it is eligible for recovery, we&apos;ll send a secure reset link.</p>
          {error && <p role="alert" className="mt-7 rounded-xl bg-[#fff0ed] px-4 py-3 text-sm font-semibold leading-6 text-[#9d2f1c]">{error}</p>}
          {sent ? (
            <div role="status" className="mt-7 rounded-xl bg-[#eef6ed] px-4 py-4 text-sm leading-6 text-[#2c6344]">If an eligible account matches that email address, a password-reset message is on its way. Check your inbox and spam folder.</div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-7 grid gap-4">
              <div><label htmlFor="email" className="mb-2 block text-sm font-bold text-[#27483c]">Account email</label><input id="email" name="email" type="email" required autoComplete="email" placeholder="you@business.com" className="w-full rounded-xl border border-[#ccd8d1] px-4 py-3 text-[#17382f] outline-none transition placeholder:text-[#9aa9a1] focus:border-[#17382f] focus:ring-4 focus:ring-[#d9ff5a]/40" /></div>
              <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#17382f] px-4 py-3.5 text-sm font-extrabold text-white transition hover:bg-[#254d42] disabled:cursor-wait disabled:opacity-70"><Send className="h-4 w-4 text-[#d9ff5a]" />{isSubmitting ? "Sending secure link…" : "Email reset link"}</button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
