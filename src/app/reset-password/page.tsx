"use client";

import Link from "next/link";
import { CheckCircle2, KeyRound, LoaderCircle } from "lucide-react";
import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/lib/auth-client";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const invalidToken = searchParams.get("error") === "INVALID_TOKEN" || !token;
  const [error, setError] = useState<string | null>(invalidToken ? "This password-reset link is invalid or has expired." : null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;

    setError(null);
    const formData = new FormData(event.currentTarget);
    const newPassword = String(formData.get("newPassword") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (newPassword !== confirmPassword) {
      setError("The password confirmation does not match.");
      return;
    }

    setIsSubmitting(true);
    const { error: resetError } = await resetPassword({ newPassword, token });
    setIsSubmitting(false);

    if (resetError) {
      setError(resetError.message ?? "We could not reset your password. Please request a new link and try again.");
      return;
    }

    setCompleted(true);
    window.setTimeout(() => router.replace("/sign-in?reset=success"), 1200);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f7f2] p-5 sm:p-8">
      <div className="w-full max-w-md">
        <Link href="/sign-in" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[#5b7066] transition hover:text-[#17382f]">Northstar manager sign in</Link>
        <section className="rounded-[2rem] border border-[#dce5df] bg-white p-6 shadow-[0_20px_60px_rgba(18,45,38,0.09)] sm:p-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d9ff5a] text-[#17382f]"><KeyRound className="h-5 w-5" /></div>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-3xl font-bold tracking-[-0.055em] text-[#17382f]">Choose a new password.</h1>
          <p className="mt-2 text-sm leading-6 text-[#61746a]">Use a new password with at least eight characters. Other active sessions will be signed out.</p>
          {completed ? (
            <p role="status" className="mt-7 flex items-start gap-2 rounded-xl bg-[#eef6ed] px-4 py-4 text-sm leading-6 text-[#2c6344]"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />Password updated. Redirecting you to sign in…</p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-7 grid gap-4">
              <div><label htmlFor="newPassword" className="mb-2 block text-sm font-bold text-[#27483c]">New password</label><input id="newPassword" name="newPassword" type="password" required minLength={8} maxLength={128} disabled={invalidToken} autoComplete="new-password" placeholder="At least 8 characters" className="w-full rounded-xl border border-[#ccd8d1] px-4 py-3 text-[#17382f] outline-none transition placeholder:text-[#9aa9a1] focus:border-[#17382f] focus:ring-4 focus:ring-[#d9ff5a]/40 disabled:cursor-not-allowed disabled:bg-[#f4f6f4]" /></div>
              <div><label htmlFor="confirmPassword" className="mb-2 block text-sm font-bold text-[#27483c]">Confirm new password</label><input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} maxLength={128} disabled={invalidToken} autoComplete="new-password" className="w-full rounded-xl border border-[#ccd8d1] px-4 py-3 text-[#17382f] outline-none transition focus:border-[#17382f] focus:ring-4 focus:ring-[#d9ff5a]/40 disabled:cursor-not-allowed disabled:bg-[#f4f6f4]" /></div>
              {error && <p role="alert" className="rounded-xl bg-[#fff0ed] px-3 py-2.5 text-sm font-semibold text-[#9d2f1c]">{error}</p>}
              <button type="submit" disabled={isSubmitting || invalidToken} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#17382f] px-4 py-3.5 text-sm font-extrabold text-white transition hover:bg-[#254d42] disabled:cursor-wait disabled:opacity-70">{isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "Save new password"}</button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return <Suspense fallback={<main className="min-h-screen bg-[#f6f7f2]" />}><ResetPasswordContent /></Suspense>;
}
