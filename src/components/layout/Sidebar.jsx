import {
  IconChartLine,
  IconHome,
  IconChartPie,
  IconEye,
  IconLogout,
  IconSettings
} from "@tabler/icons-react";
import NotificationPanel from "./NotificationPanel";
import { NavLink, Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { logout } from "../../api/auth";
import { IconX } from "@tabler/icons-react";

const markets = [
  { name: "NEPSE",  slug: "nepse",  color: "bg-emerald-500" },
  { name: "ASX",    slug: "asx",    color: "bg-blue-500" },
  { name: "NYSE",   slug: "nyse",   color: "bg-blue-400" },
  { name: "NASDAQ", slug: "nasdaq", color: "bg-cyan-500" },
];

export default function Sidebar({ onClose }) {
  const { platform } = useParams();
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      await logout(refreshToken);
    } catch {
      // Even if API call fails, clear local tokens
    } finally {
      logoutUser();
      navigate("/login");
    }
  };

  // Pull name/email from JWT payload if stored, otherwise fallback
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const displayName = storedUser.name || "User";
  const displayEmail = storedUser.email || "";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <aside className="w-[210px] h-full bg-[#1d3354] border-r border-white/10 flex flex-col">

      {/* Logo */}
      <div className="p-4 border-b border-white/10 flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-[#00c896] flex items-center justify-center">
          <IconChartLine size={16} />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold">PortfolioTracker</div>
          <div className="text-[10px] text-[#5d7a9a]">Personal</div>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="lg:hidden text-[#5d7a9a] hover:text-white transition"
        >
          <IconX size={16} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 text-sm text-[#8fa3bf]">

        <div className="px-5 text-[10px] uppercase mb-2">Overview</div>

        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 text-sm border-l-2 transition ${
              isActive
                ? "border-blue-500 bg-blue-500/10 text-blue-400"
                : "border-transparent text-gray-300 hover:bg-white/5"
            }`
          }
        >
          <IconHome size={16} />
          Dashboard
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 text-sm border-l-2 transition ${
              isActive
                ? "border-blue-500 bg-blue-500/10 text-blue-400"
                : "border-transparent text-gray-300 hover:bg-white/5"
            }`
          }
        >
          <IconChartPie size={16} />
          Analytics
        </NavLink>

        <div className="px-5 text-[10px] uppercase mt-4 mb-2">Holdings</div>

        {markets.map((m) => (
          <Link
            key={m.slug}
            to={`/portfolio/${m.slug}`}
            className={`flex items-center gap-2 px-4 py-2 text-sm ${
              platform === m.slug
                ? "bg-white/10 text-white"
                : "text-slate-400 hover:bg-white/5"
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${m.color}`} />
            {m.name}
          </Link>
        ))}

        <div className="px-5 text-[10px] uppercase mt-4 mb-2">Trading</div>

        <NavLink
          to="/watchlist"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 text-sm border-l-2 transition ${
              isActive
                ? "border-blue-500 bg-blue-500/10 text-blue-400"
                : "border-transparent text-gray-300 hover:bg-white/5"
            }`
          }
        >
          <IconEye size={16} />
          Watchlist
        </NavLink>

        <div className="px-5 text-[10px] uppercase mt-4 mb-2">Tools</div>

        <NotificationPanel />

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 text-sm border-l-2 transition ${
              isActive
                ? "border-blue-500 bg-blue-500/10 text-blue-400"
                : "border-transparent text-gray-300 hover:bg-white/5"
            }`
          }
          
        >
          <IconSettings size={16} />
          Settings
        </NavLink>
        

      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-white/10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#1a6bbc] flex items-center justify-center text-sm font-semibold">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium truncate">{displayName}</div>
          <div className="text-[10px] text-[#5d7a9a] truncate">{displayEmail}</div>
        </div>
        <button
          onClick={handleLogout}
          className="text-[#5d7a9a] hover:text-red-400 transition"
          title="Logout"
        >
          <IconLogout size={16} />
        </button>
      </div>

    </aside>
  );
}