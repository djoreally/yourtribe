"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useSession } from "@/lib/auth-client";

type SessionState = ReturnType<typeof useSession>;

const AuthSessionContext = createContext<SessionState | null>(null);

/**
 * Better Auth already provides a reactive session store through useSession.
 * This provider makes that state available to shared UI such as account menus,
 * while keeping all browser requests on the same-origin /api/auth endpoint.
 */
export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const sessionState = useSession();
  const value = useMemo(() => sessionState, [sessionState]);

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}

export function useAuthSession() {
  const session = useContext(AuthSessionContext);
  if (!session) {
    throw new Error("useAuthSession must be used within AuthSessionProvider.");
  }
  return session;
}
