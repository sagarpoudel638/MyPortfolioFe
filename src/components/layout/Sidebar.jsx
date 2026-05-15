
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

export default function Sidebar() {
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

        <div className="flex items-center gap-2 px-5 py-2 bg-[#1a6bbc]/20 border-l-2 border-[#2e82d8] text-[#2e82d8]">
          <IconHome size={16} />
          Dashboard
        </div>

        <div className="flex items-center gap-2 px-5 py-2 hover:bg-white/5">
          <IconChartPie size={16} />
          Analytics
        </div>
        <div className="px-5 text-[10px] uppercase mt-4 mb-2">Holdings</div>
        <div className="flex items-center gap-2 px-5 py-2 hover:bg-white/5">
          <IconBriefcase size={16} />
          All Holdings
        </div>
               <div className="pl-8 py-1 text-xs text-[#8fa3bf] hover:bg-white/5">
              CommBank
            </div>
              <div className="pl-8 py-1 text-xs text-[#8fa3bf] hover:bg-white/5">
              Commsec
            </div>
             <div className="pl-8 py-1 text-xs text-[#8fa3bf] hover:bg-white/5">
              Webull
            </div>
             <div className="pl-8 py-1 text-xs text-[#8fa3bf] hover:bg-white/5">
              NEPSE
            </div>    
        <div className="px-5 text-[10px] uppercase mt-4 mb-2">Trading</div>
        
        <div className="flex items-center gap-2 px-5 py-2 hover:bg-white/5">
          <IconBriefcase size={16} />
          Trade Journal
        </div>

        <div className="flex items-center gap-2 px-5 py-2 hover:bg-white/5">
          <IconEye size={16} />
          Watchlist
        </div>

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