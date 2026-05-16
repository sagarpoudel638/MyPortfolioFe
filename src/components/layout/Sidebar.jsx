
import {
  IconChartLine,
  IconHome,
  IconChartPie,
  IconBriefcase,
  IconEye,
  IconBell,
  IconDownload,
  IconSettings,
} from "@tabler/icons-react";
import { NavLink } from "react-router-dom";
import { Link, useParams } from "react-router-dom";
const platforms = [
  { name: "Meroshare", slug: "meroshare", color: "bg-emerald-500" },
  { name: "CommBank", slug: "commbank", color: "bg-blue-500" },
  { name: "CommSec Pocket", slug: "commsecpocket", color: "bg-blue-500" },
  { name: "Webull", slug: "webull", color: "bg-blue-500" },
];
export default function Sidebar() {
     const { platform } = useParams();
  return (
    <aside className="w-[210px] bg-[#1d3354] border-r border-white/10 flex flex-col">

      {/* Logo */}
      <div className="p-4 border-b border-white/10 flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-[#00c896] flex items-center justify-center">
          <IconChartLine size={16} />
        </div>

        <div>
          <div className="text-sm font-semibold">PortfolioTracker</div>
          <div className="text-[10px] text-[#5d7a9a]">Personal</div>
        </div>
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
      
      {platforms.map((p) => (
        <Link
          key={p.slug}
          to={`/portfolio/${p.slug}`}
          className={`flex items-center gap-2 px-4 py-2 text-sm
            ${
              platform === p.slug
                ? "bg-white/10 text-white"
                : "text-slate-400 hover:bg-white/5"
            }`}
        >
          <span className={`h-2 w-2 rounded-full ${p.color}`} />
          {p.name}
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

        <div className="flex items-center gap-2 px-5 py-2 hover:bg-white/5">
          <IconBell size={16} />
          Notifications
        </div>

        <div className="flex items-center gap-2 px-5 py-2 hover:bg-white/5">
          <IconDownload size={16} />
          Export
        </div>
      </nav>

      {/* User */}
      <div className="p-4 border-t border-white/10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#1a6bbc] flex items-center justify-center">
          S
        </div>

        <div>
          <div className="text-xs font-medium">Sagar Poudel</div>
          <div className="text-[10px] text-[#5d7a9a]">sagar@email.com</div>
        </div>

        <IconSettings className="ml-auto text-[#5d7a9a]" size={16} />
      </div>
    </aside>
  );
}