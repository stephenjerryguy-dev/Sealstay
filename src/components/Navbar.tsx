import { ArrowUpRight, LogOut } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import SealMark from "./SealMark";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/listings", label: "Listings" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/innovations", label: "Innovations" },
  { to: "/for-landlords", label: "List Property" },
];

export default function Navbar() {
  const { user, signOut, promptSignIn } = useAuth();

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 px-8 lg:px-16">
      <div className="flex items-center justify-between">
        <Link to="/" aria-label="SealStay home" className="block">
          <SealMark />
        </Link>

        <div className="hidden md:flex liquid-glass rounded-full px-1.5 py-1.5 items-center gap-0">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium font-body rounded-full whitespace-nowrap transition-colors ${
                  isActive ? "text-sealSky" : "text-white/80 hover:text-sealSky"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          {user ? (
            <Link
              to={user.role === "landlord" ? "/landlord-portal" : user.role === "admin" ? "/admin/dashboard" : "/student-portal"}
              className="bg-sealOrange text-white rounded-full px-4 py-2 text-sm font-medium font-body whitespace-nowrap inline-flex items-center gap-1 ml-1.5 hover:bg-sealOrangeDeep transition-colors"
            >
              {user.name.split(" ")[0] || "Portal"}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={promptSignIn}
              className="bg-sealOrange text-white rounded-full px-4 py-2 text-sm font-medium font-body whitespace-nowrap inline-flex items-center gap-1 ml-1.5 hover:bg-sealOrangeDeep transition-colors"
            >
              Sign In
              <ArrowUpRight className="h-4 w-4" />
            </button>
          )}
        </div>

        {user ? (
          <button
            type="button"
            onClick={signOut}
            aria-label="Sign out"
            title="Sign out"
            className="liquid-glass rounded-full w-12 h-12 flex items-center justify-center text-white/80 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
          </button>
        ) : (
          <div className="w-12 h-12" aria-hidden />
        )}
      </div>
    </nav>
  );
}
