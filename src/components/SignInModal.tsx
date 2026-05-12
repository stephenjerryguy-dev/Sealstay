import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";
import { useAuth, type Role } from "../context/AuthContext";

export default function SignInModal() {
  const { modalOpen, closeModal, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("student");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setBusy(true);
    try {
      await signIn(email, role);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm"
          onClick={closeModal}
        >
          <motion.div
            initial={{ y: 30, opacity: 0, filter: "blur(8px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="liquid-glass-strong relative w-full max-w-md p-8"
            style={{ borderRadius: "1.5rem" }}
          >
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close"
              className="absolute top-4 right-4 text-white/70 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <p className="text-xs font-body text-white/60 mb-2">// Sign in</p>
            <h2 className="font-heading italic text-white text-4xl tracking-[-1px] leading-none">
              Welcome back
            </h2>
            <p className="mt-3 text-sm font-body font-light text-white/85">
              We send a magic link to your email. No passwords. No noise.
            </p>

            <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
              <label className="block">
                <span className="text-xs font-body text-white/70">Email</span>
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@sgu.edu"
                  className="mt-1 w-full bg-white/5 text-white placeholder-white/40 px-4 py-3 outline-none border border-white/15 focus:border-white/40 transition"
                  style={{ borderRadius: "0.75rem" }}
                />
              </label>

              <div>
                <span className="text-xs font-body text-white/70">I am a</span>
                <div className="mt-1.5 grid grid-cols-3 gap-2">
                  {(["student", "landlord", "admin"] as Role[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`px-3 py-2 text-xs font-body capitalize transition ${
                        role === r
                          ? "bg-white text-black"
                          : "liquid-glass text-white/85"
                      }`}
                      style={{ borderRadius: "0.75rem" }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="liquid-glass-strong rounded-full px-5 py-3 text-sm font-medium font-body text-white disabled:opacity-50"
              >
                {busy ? "Sending…" : "Send magic link"}
              </button>

              <p className="text-[11px] font-body text-white/50 leading-snug">
                Mock auth for now — any email works and you'll be signed in
                locally. Magic-link mailer lands when we wire Supabase.
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
