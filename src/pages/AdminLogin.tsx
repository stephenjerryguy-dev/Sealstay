import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  Clock,
  Crown,
  Eye,
  EyeOff,
  Fingerprint,
  Lock,
  Shield,
  UserCog,
} from "lucide-react";
import SealMark from "../components/SealMark";

type AdminRole = "owner" | "staff";

export type AdminSession = {
  email: string;
  role: AdminRole;
  name: string;
  loginTime: string;
};

const STORAGE_KEY = "ss_admin_auth";

const CREDENTIALS: Array<
  AdminSession & { password: string; access: string }
> = [
  {
    email: "owner@sealstay.gd",
    password: "SealOS2026!",
    role: "owner",
    name: "Owner",
    loginTime: "",
    access: "Full platform access: financials, analytics, settings, audit log, staff management.",
  },
  {
    email: "kezia@sealstay.gd",
    password: "Staff2026!",
    role: "staff",
    name: "Kezia Morrison",
    loginTime: "",
    access: "Operations access: listings, landlords, students, disputes, lease relief.",
  },
  {
    email: "andre@sealstay.gd",
    password: "Staff2026!",
    role: "staff",
    name: "Andre Phillip",
    loginTime: "",
    access: "Operations access: listings, landlords, students, disputes, lease relief.",
  },
];

export function getAdminSession(): AdminSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AdminSession) : null;
  } catch {
    return null;
  }
}

export function clearAdminSession() {
  localStorage.removeItem(STORAGE_KEY);
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (getAdminSession()) navigate("/admin/dashboard", { replace: true });
  }, [navigate]);

  const detected = useMemo(
    () => CREDENTIALS.find((c) => c.email === email.trim().toLowerCase()),
    [email],
  );
  const accent = detected?.role === "owner" ? "#ff6a1a" : "#38bdf8";

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    await new Promise((resolve) => setTimeout(resolve, 550));

    const match = CREDENTIALS.find(
      (c) => c.email === email.trim().toLowerCase() && c.password === password,
    );

    if (!match) {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      setError(
        nextAttempts >= 3
          ? "Multiple failed attempts detected. In production this account would be temporarily locked."
          : "Invalid credentials. Access denied.",
      );
      setLoading(false);
      return;
    }

    const session: AdminSession = {
      email: match.email,
      role: match.role,
      name: match.name,
      loginTime: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    navigate("/admin/dashboard", { replace: true });
  }

  return (
    <main className="min-h-screen overflow-hidden bg-sealNavyDeep px-4 py-8 text-white">
      <div className="pointer-events-none fixed inset-0">
        <div
          className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full opacity-15 blur-3xl"
          style={{ background: accent }}
        />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center">
        <section
          className="liquid-glass-strong p-8"
          style={{ borderRadius: "1.5rem", borderColor: `${accent}33` }}
        >
          <div className="mb-8 text-center">
            <div className="mb-5 flex justify-center">
              <SealMark />
            </div>
            <div
              className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium"
              style={{
                borderColor: `${accent}55`,
                backgroundColor: `${accent}18`,
                color: accent,
              }}
            >
              {detected?.role === "owner" ? <Crown size={12} /> : <Shield size={12} />}
              {detected?.role === "owner" ? "Owner Suite" : "Internal Operations Portal"}
            </div>
            <h1 className="font-heading text-4xl leading-none tracking-[-1px]">
              SealStay OS
            </h1>
            <p className="mt-2 text-xs font-body text-white/45">
              Authorized personnel only · audit logged
            </p>
          </div>

          {detected && (
            <div
              className="mb-4 rounded-2xl border p-3"
              style={{ borderColor: `${accent}33`, backgroundColor: `${accent}12` }}
            >
              <div className="mb-1 flex items-center gap-2 text-xs font-semibold" style={{ color: accent }}>
                {detected.role === "owner" ? <Crown size={13} /> : <UserCog size={13} />}
                {detected.role === "owner" ? "Owner Account" : `Staff Account: ${detected.name}`}
              </div>
              <p className="text-[11px] leading-snug text-white/55">{detected.access}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <label className="block">
              <span className="text-xs font-body text-white/65">Work Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="you@sealstay.gd"
                className="mt-1 w-full border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-white/40"
                style={{ borderRadius: "0.8rem", caretColor: accent }}
              />
            </label>

            <label className="block">
              <span className="text-xs font-body text-white/65">Password</span>
              <div className="relative mt-1">
                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Password"
                  className="w-full border border-white/15 bg-white/5 px-4 py-3 pr-12 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-white/40"
                  style={{ borderRadius: "0.8rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/45 hover:text-white"
                >
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </label>

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs text-red-100">
                <AlertTriangle size={13} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-black transition disabled:opacity-60"
              style={{ backgroundColor: accent }}
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/80 border-t-transparent" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Fingerprint size={15} />
                  {detected?.role === "owner" ? "Access Owner Suite" : "Access Operations Portal"}
                </>
              )}
            </button>
          </form>

          <div className="mt-5 rounded-2xl border border-white/5 bg-white/[0.03] p-3">
            <div className="flex items-center justify-center gap-4">
              {[
                { icon: Lock, label: "Encrypted" },
                { icon: Clock, label: "24h session" },
                { icon: Shield, label: "Audit logged" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-[10px] text-white/35">
                  <Icon size={11} />
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => setHint((v) => !v)}
              className="text-xs text-white/25 transition hover:text-white/60"
            >
              {hint ? "Hide credentials" : "Demo credentials"}
            </button>
            {hint && (
              <div className="mt-3 space-y-2 rounded-2xl border border-white/10 bg-white/5 p-3 text-left">
                {CREDENTIALS.map((credential) => (
                  <div key={credential.email} className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-white/80">{credential.name}</p>
                      <p className="font-mono text-[11px] text-white/40">{credential.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEmail(credential.email);
                        setPassword(credential.password);
                        setError("");
                      }}
                      className="rounded-full px-3 py-1 text-xs"
                      style={{
                        backgroundColor:
                          credential.role === "owner" ? "rgba(255,106,26,0.18)" : "rgba(56,189,248,0.18)",
                        color: credential.role === "owner" ? "#ff6a1a" : "#38bdf8",
                      }}
                    >
                      Fill
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="mx-auto mt-5 inline-flex items-center gap-2 text-xs text-white/30 transition hover:text-white/65"
        >
          <ArrowLeft size={13} />
          Return to site
        </button>
      </div>
    </main>
  );
}
