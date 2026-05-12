import { useEffect } from "react";
import { useAuth, type Role } from "../context/AuthContext";
import PageShell from "./PageShell";

type Props = {
  /** If set, only users with one of these roles can pass. */
  roles?: Role[];
  children: React.ReactNode;
};

export default function ProtectedPage({ roles, children }: Props) {
  const { user, promptSignIn } = useAuth();
  const allowed = user && (!roles || roles.includes(user.role));

  // Auto-open the sign-in modal the first time someone hits a gated route.
  useEffect(() => {
    if (!user) promptSignIn();
  }, [user, promptSignIn]);

  if (!allowed) {
    return (
      <PageShell
        kicker="Sign in required"
        title={user ? "Wrong account type" : "You'll need an account"}
        subtitle={
          user
            ? `This area is for ${roles?.join(" / ")}. You're signed in as ${user.role}.`
            : "Sign in to view your bookings, lease status, and saved listings."
        }
      >
        <button
          type="button"
          onClick={promptSignIn}
          className="liquid-glass-strong rounded-full px-5 py-2.5 text-sm font-medium font-body text-white"
        >
          {user ? "Switch account" : "Sign in"}
        </button>
      </PageShell>
    );
  }

  return <>{children}</>;
}
