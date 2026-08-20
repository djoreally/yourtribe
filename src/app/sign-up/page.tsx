"use client";

import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2, LoaderCircle } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const workspaceName = String(formData.get("workspaceName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      setError("The password confirmation does not match.");
      return;
    }

    setIsSubmitting(true);
    const { error: signUpError } = await signUp.email({
      name,
      email,
      password,
      callbackURL: "/dashboard",
    });

    if (signUpError) {
      setError(signUpError.message ?? "We could not create your account. Please try again.");
      setIsSubmitting(false);
      return;
    }

    const workspaceResponse = await fetch("/api/v1/manager/workspace", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ workspaceName }),
    });

    if (!workspaceResponse.ok) {
      const payload = await workspaceResponse.json().catch(() => null) as { error?: string } | null;
      setError(payload?.error ?? "Your account was created, but we could not finish your workspace setup. Please sign in and try again.");
      setIsSubmitting(false);
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f7f2] p-5 sm:p-8">
      <div className="w-full max-w-lg">
        <Link href="/" className="mb-9 inline-flex items-center gap-2 text-sm font-bold text-[#5b7066] transition hover:text-[#17382f]">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#17382f] font-[family-name:var(--font-display)] text-[11px] font-extrabold tracking-[-0.1em] text-[#d9ff5a]">CP</span>
          Content Pyramid
        </Link>
        <div className="rounded-[2rem] border border-[#dce5df] bg-white p-6 shadow-[0_20px_60px_rgba(18,45,38,0.09)] sm:p-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d9ff5a] text-[#17382f]"><Building2 className="h-5 w-5" /></div>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-3xl font-bold tracking-[-0.055em] text-[#17382f]">Start your workspace.</h1>
          <p className="mt-2 text-sm leading-6 text-[#61746a]">Create your secure manager account and your first place to review community content.</p>
          <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-[#eef4ec] px-3.5 py-3 text-xs leading-5 text-[#426252]"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2e7851]" />Your password is stored securely. You can change it later from Account security.</div>
          <form onSubmit={handleSubmit} className="mt-7 grid gap-4">
            <div><label htmlFor="name" className="mb-2 block text-sm font-bold text-[#27483c]">Your name</label><input id="name" name="name" required minLength={2} autoComplete="name" placeholder="Alex Morgan" className="w-full rounded-xl border border-[#ccd8d1] px-4 py-3 text-[#17382f] outline-none transition placeholder:text-[#9aa9a1] focus:border-[#17382f] focus:ring-4 focus:ring-[#d9ff5a]/40" /></div>
            <div><label htmlFor="workspaceName" className="mb-2 block text-sm font-bold text-[#27483c]">Business or workspace name</label><input id="workspaceName" name="workspaceName" required minLength={2} maxLength={80} autoComplete="organization" placeholder="Ambler Brewing Co." className="w-full rounded-xl border border-[#ccd8d1] px-4 py-3 text-[#17382f] outline-none transition placeholder:text-[#9aa9a1] focus:border-[#17382f] focus:ring-4 focus:ring-[#d9ff5a]/40" /></div>
            <div><label htmlFor="email" className="mb-2 block text-sm font-bold text-[#27483c]">Work email</label><input id="email" name="email" type="email" required autoComplete="email" placeholder="you@business.com" className="w-full rounded-xl border border-[#ccd8d1] px-4 py-3 text-[#17382f] outline-none transition placeholder:text-[#9aa9a1] focus:border-[#17382f] focus:ring-4 focus:ring-[#d9ff5a]/40" /></div>
            <div><label htmlFor="password" className="mb-2 block text-sm font-bold text-[#27483c]">Create a password</label><input id="password" name="password" type="password" required minLength={8} maxLength={128} autoComplete="new-password" placeholder="At least 8 characters" className="w-full rounded-xl border border-[#ccd8d1] px-4 py-3 text-[#17382f] outline-none transition placeholder:text-[#9aa9a1] focus:border-[#17382f] focus:ring-4 focus:ring-[#d9ff5a]/40" /></div>
            <div><label htmlFor="confirmPassword" className="mb-2 block text-sm font-bold text-[#27483c]">Confirm password</label><input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} maxLength={128} autoComplete="new-password" placeholder="Re-enter your password" className="w-full rounded-xl border border-[#ccd8d1] px-4 py-3 text-[#17382f] outline-none transition placeholder:text-[#9aa9a1] focus:border-[#17382f] focus:ring-4 focus:ring-[#d9ff5a]/40" /></div>
            {error && <p role="alert" className="rounded-xl bg-[#fff0ed] px-3 py-2.5 text-sm font-semibold text-[#9d2f1c]">{error}</p>}
            <button type="submit" disabled={isSubmitting} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#17382f] px-4 py-3.5 text-sm font-extrabold text-white transition hover:bg-[#254d42] disabled:cursor-wait disabled:opacity-70">{isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <>Create account <ArrowRight className="h-4 w-4 text-[#d9ff5a]" /></>}</button>
          </form>
          <p className="mt-6 text-center text-sm text-[#6a7d73]">Already have an account? <Link href="/sign-in" className="font-bold text-[#244e3d] hover:underline">Sign in</Link></p>
        </div>
      </div>
    </main>
  );
}
