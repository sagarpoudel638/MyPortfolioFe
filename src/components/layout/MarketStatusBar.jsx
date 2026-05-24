// src/components/layout/MarketStatusBar.jsx
import { useState, useEffect, useRef } from "react";
import { getMarketStatus } from "../../api/prices";

const MARKET_COLORS = {
  ASX:   { open: "bg-emerald-500", closed: "bg-slate-500", text: "text-emerald-400", closedText: "text-slate-400" },
  NYSE:  { open: "bg-blue-500",    closed: "bg-slate-500", text: "text-blue-400",    closedText: "text-slate-400" },
  NEPSE: { open: "bg-[#00c896]",   closed: "bg-slate-500", text: "text-[#00c896]",   closedText: "text-slate-400" },
};

const formatCountdown = (ms) => {
  if (ms <= 0) return "now";

  const totalSeconds = Math.floor(ms / 1000);
  const hours        = Math.floor(totalSeconds / 3600);
  const minutes      = Math.floor((totalSeconds % 3600) / 60);
  const seconds      = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
};

function MarketBadge({ market, countdown }) {
  const colors  = MARKET_COLORS[market.label] || MARKET_COLORS.ASX;
  const isOpen  = market.isOpen;

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium transition-all ${
      isOpen
        ? "border-emerald-500/30 bg-emerald-500/10"
        : "border-white/10 bg-white/5"
    }`}>
      {/* Pulsing dot */}
      <span className="relative flex h-1.5 w-1.5">
        {isOpen && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${colors.open}`} />
        )}
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isOpen ? colors.open : colors.closed}`} />
      </span>

      {/* Label */}
      <span className={isOpen ? colors.text : colors.closedText}>
        {market.label}
      </span>

      {/* Status + countdown */}
      <span className="text-[#5d7a9a]">
        {isOpen ? "OPEN" : "CLOSED"}
      </span>

      {countdown !== null && (
        <span className={`font-mono text-[10px] ${isOpen ? "text-emerald-400" : "text-[#5d7a9a]"}`}>
          · {market.nextEventLabel} {countdown}
        </span>
      )}
    </div>
  );
}

export default function MarketStatusBar() {
  const [markets, setMarkets]       = useState([]);
  const [countdowns, setCountdowns] = useState({});
  const intervalRef                 = useRef(null);
  const fetchRef                    = useRef(null);

  const fetchStatus = async () => {
    try {
      const { data } = await getMarketStatus();
      setMarkets(Array.isArray(data) ? data : []);

      // Initialise countdowns from server response
      const initial = {};
      data.forEach((m) => { initial[m.label] = m.nextEventMs; });
      setCountdowns(initial);
    } catch {
      // fail silently
    }
  };

  // Tick countdown every second
  useEffect(() => {
    fetchStatus();

    // Refresh market status from server every 60 seconds
    fetchRef.current = setInterval(fetchStatus, 60000);

    // Tick every second
    intervalRef.current = setInterval(() => {
      setCountdowns((prev) => {
        const updated = {};
        Object.entries(prev).forEach(([label, ms]) => {
          updated[label] = Math.max(0, ms - 1000);
        });
        return updated;
      });
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(fetchRef.current);
    };
  }, []);

  if (markets.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {markets.map((market) => (
        <MarketBadge
          key={market.label}
          market={market}
          countdown={
            countdowns[market.label] !== undefined
              ? formatCountdown(countdowns[market.label])
              : null
          }
        />
      ))}
    </div>
  );
}