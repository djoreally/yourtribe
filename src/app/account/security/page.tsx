"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, KeyRound, LoaderCircle, ShieldCheck } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useAuthSession } from "@/components/auth/AuthSessionProvider";

export default function AccountSecurityPage() {
  const router = useRouter();
  const { data, isPending } = useAuthSession();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!isPending && !data?.user) router.replace("/sign-in?callbackUrl=/account/security");
  }, [data?.user, isPending, router]);

  async function handleResendVerification() {
    if (!data?.user) return;
    setVerificationStatus(null);
    setIsSendingVerification(true);
    const { error: verificationError } = await authClient.sendVerificationEmail({
      email: data.user.email,
      callbackURL: "/dashboard",
    });
    setIsSendingVerification(false);
    setVerificationStatus(verificationError ? "We could not send another verification link. Please try again." : "Verification email sent. Check your inbox and spam folder.");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);
    const currentPassword = String(formData.get("currentPassword") ?? "");
    const newPassword = String(formData.get("newPassword") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (newPassword !== confirmPassword) {
      setError("The new password confirmation does not match.");
      return;
    }

    setIsSubmitting(true);
    const { error: passwordError } = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    });
    setIsSubmitting(false);

    if (passwordError) {
      setError(passwordError.message ?? "We could not update your password. Please check your current password and try again.");
      return;
    }

    event.currentTarget.reset();
    setSuccess("Password updated. Other active sessions have been signed out.");
  }

  if (isPending || !data?.user) {
    return <main className="min-h-screen bg-[#f6f7f2]" aria-busy="true" />;
  }

  return (
    <main className="min-h-screen bg-[#f6f7f2] px-5 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto w-full max-w-xl">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-[#5b7066] transition hover:text-[#17382f]"><ArrowLeft className="h-4 w-4" />Back to workspace</Link>
        <section className="mt-7 rounded-[2rem] border border-[#dce5df] bg-white p-6 shadow-[0_20px_60px_rgba(18,45,38,0.09)] sm:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d9ff5a] text-[#17382f]"><ShieldCheck className="h-6 w-6" /></div>
          <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.16em] text-[#60766a]">Account security</p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold tracking-[-0.055em] text-[#17382f]">Update your password.</h1>
          <p className="mt-2 text-sm leading-6 text-[#61746a]">You are signed in as <strong className="font-bold text-[#27483c]">{data.user.email}</strong>. Saving a new password signs out your other sessions.</p>
          {data.user.emailVerified ? <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#2c6344]"><CheckCircle2 className="h-4 w-4" />Email verified</p> : <div className="mt-5 rounded-xl bg-[#fff8e8] px-3.5 py-3 text-sm leading-5 text-[#785617]"><p className="font-bold">Your email is not verified.</p><p className="mt-1">Confirm ownership to keep account recovery dependable.</p><button type="button" onClick={handleResendVerification} disabled={isSendingVerification} className="mt-2.5 font-bold text-[#244e3d] underline underline-offset-2 disabled:cursor-wait disabled:opacity-70">{isSendingVerification ? "Sending verification email…" : "Resend verification email"}</button>{verificationStatus && <p role="status" className="mt-2 font-semibold text-[#5d4a1e]">{verificationStatus}</p>}</div>}
          <form onSubmit={handleSubmit} className="mt-7 grid gap-4">
            <div><label htmlFor="currentPassword" className="mb-2 block text-sm font-bold text-[#27483c]">Current password</label><input id="currentPassword" name="currentPassword" type="password" required autoComplete="current-password" className="w-full rounded-xl border border-[#ccd8d1] px-4 py-3 text-[#17382f] outline-none transition focus:border-[#17382f] focus:ring-4 focus:ring-[#d9ff5a]/40" /></div>
            <div><label htmlFor="newPassword" className="mb-2 block text-sm font-bold text-[#27483c]">New password</label><input id="newPassword" name="newPassword" type="password" required minLength={8} maxLength={128} autoComplete="new-password" placeholder="At least 8 characters" className="w-full rounded-xl border border-[#ccd8d1] px-4 py-3 text-[#17382f] outline-none transition placeholder:text-[#9aa9a1] focus:border-[#17382f] focus:ring-4 focus:ring-[#d9ff5a]/40" /></div>
            <div><label htmlFor="confirmPassword" className="mb-2 block text-sm font-bold text-[#27483c]">Confirm new password</label><input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} maxLength={128} autoComplete="new-password" className="w-full rounded-xl border border-[#ccd8d1] px-4 py-3 text-[#17382f] outline-none transition focus:border-[#17382f] focus:ring-4 focus:ring-[#d9ff5a]/40" /></div>
            {error && <p role="alert" className="rounded-xl bg-[#fff0ed] px-3 py-2.5 text-sm font-semibold text-[#9d2f1c]">{error}</p>}
            {success && <p role="status" className="flex items-start gap-2 rounded-xl bg-[#eef6ed] px-3 py-2.5 text-sm font-semibold text-[#276040]"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />{success}</p>}
            <button type="submit" disabled={isSubmitting} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#17382f] px-4 py-3.5 text-sm font-extrabold text-white transition hover:bg-[#254d42] disabled:cursor-wait disabled:opacity-70">{isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <><KeyRound className="h-4 w-4 text-[#d9ff5a]" />Update password</>}</button>
          </form>
        </section>
      </div>
    </main>
  );
}
