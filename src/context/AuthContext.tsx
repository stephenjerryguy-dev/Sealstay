import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Role = "student" | "landlord" | "admin";
export type User = {
  email: string;
  name: string;
  role: Role;
};

type AuthState = {
  user: User | null;
  signIn: (email: string, role?: Role) => Promise<void>;
  signOut: () => void;
  /** Convenience: open the global sign-in modal. */
  promptSignIn: () => void;
  modalOpen: boolean;
  closeModal: () => void;
};

const AuthCtx = createContext<AuthState | null>(null);
const STORAGE_KEY = "sealstay.auth.user";

// Mock auth — local-only until Supabase / Auth0 lands. Persists in
// localStorage so a refresh keeps you signed in.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  });
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const signIn = useCallback(async (email: string, role: Role = "student") => {
    // Simulate latency. Real impl: hit Supabase magic link / OAuth.
    await new Promise((r) => setTimeout(r, 400));
    const name = email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    setUser({ email, name: name || "Student", role });
    setModalOpen(false);
  }, []);

  const signOut = useCallback(() => setUser(null), []);
  const promptSignIn = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  const value = useMemo<AuthState>(
    () => ({ user, signIn, signOut, promptSignIn, modalOpen, closeModal }),
    [user, signIn, signOut, promptSignIn, modalOpen, closeModal],
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const v = useContext(AuthCtx);
  if (!v) throw new Error("useAuth must be inside <AuthProvider>");
  return v;
}
