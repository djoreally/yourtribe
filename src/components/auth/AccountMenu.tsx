"use client";

import Link from "next/link";
import { LogOut, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signOut } from "@/lib/auth-client";
import { useAuthSession } from "@/components/auth/AuthSessionProvider";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "CP";
}

export function AccountMenu() {
  const router = useRouter();
  const { data, isPending } = useAuthSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  if (isPending) return <div className="h-9 w-9 animate-pulse rounded-full bg-[#e7eee9]" aria-label="Loading account" />;

  if (!data?.user) {
    return <Link href="/sign-in" className="rounded-xl bg-[#17382f] px-3.5 py-2 text-xs font-extrabold text-white transition hover:bg-[#254d42]">Sign in</Link>;
  }

  async function handleSignOut() {
    setIsSigningOut(true);
    await signOut();
    router.replace("/sign-in");
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-label="Open account menu"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d9ff5a] text-xs font-extrabold text-[#17382f] ring-offset-2 transition hover:ring-2 hover:ring-[#17382f]/20"
      >
        {initials(data.user.name)}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-[#dbe5dd] bg-white p-2 shadow-[0_18px_45px_rgba(18,45,38,0.16)]">
          <div className="flex items-center gap-3 px-3 py-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eaf0ec] text-[#244e3d]"><UserRound className="h-4 w-4" /></span><span className="min-w-0"><span className="block truncate text-sm font-extrabold text-[#17382f]">{data.user.name}</span><span className="block truncate text-xs text-[#708178]">{data.user.email}</span></span></div>
          <div className="my-1 border-t border-[#edf1ee]" />
          <button type="button" onClick={handleSignOut} disabled={isSigningOut} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-[#a14234] transition hover:bg-[#fff1ef] disabled:cursor-wait disabled:opacity-70"><LogOut className="h-4 w-4" />{isSigningOut ? "Signing out…" : "Sign out"}</button>
        </div>
      )}
    </div>
  );
}
