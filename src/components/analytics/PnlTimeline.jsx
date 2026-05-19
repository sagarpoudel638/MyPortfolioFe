// src/components/analytics/PnLTimeline.jsx
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { getSnapshots, triggerSnapshot } from "../../api/snapshots";
import { IconRefresh } from "@tabler/icons-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PLATFORM_COLORS = {
  commbank:      { border: "#1a6bbc", bg: "rgba(26,107,188,0.1)"  },
  commsecpocket: { border: "#2e82d8", bg: "rgba(46,130,216,0.1)"  },
  webull:        { border: "#0ea5e9", bg: "rgba(14,165,233,0.1)"  },
  meroshare:     { border: "#00c896", bg: "rgba(0,200,150,0.1)"   },
};

const PLATFORM_LABELS = {
  commbank:      "CommBank (AUD)",
  commsecpocket: "CommSec Pocket (AUD)",
  webull:        "Webull (USD)",
  meroshare:     "Meroshare (NPR)",
};

export default function PnLTimeline() {
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [days, setDays]           = useState(30);
  const [activeChart, setActiveChart] = useState("total"); // "total" | "platforms"

  const fetchSnapshots = async () => {
    try {
      setLoading(true);
      const { data } = await getSnapshots(days);
      setSnapshots(data);
    } catch {
      // fail silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSnapshots(); }, [days]);

  const handleTrigger = async () => {
    setTriggering(true);
    try {
      await triggerSnapshot();
      await fetchSnapshots();
    } finally {
      setTriggering(false);
    }
  };

  const labels = snapshots.map((s) =>
    new Date(s.date).toLocaleDateString("en-AU", {
      day:   "2-digit",
      month: "short",
    })
  );

  // ── Total portfolio chart data ───────────────────────────────────────────
  const totalChartData = {
    labels,
    datasets: [
      {
        label:           "Portfolio Value (AUD)",
        data:            snapshots.map((s) => s.totalValueAUD),
        borderColor:     "#00c896",
        backgroundColor: "rgba(0,200,150,0.1)",
        borderWidth:     2,
        pointRadius:     snapshots.length > 30 ? 0 : 3,
        pointHoverRadius: 5,
        fill:            true,
        tension:         0.3,
      },
      {
        label:           "Invested (AUD)",
        data:            snapshots.map((s) => s.totalInvestedAUD),
        borderColor:     "#5d7a9a",
        backgroundColor: "transparent",
        borderWidth:     1.5,
        borderDash:      [4, 4],
        pointRadius:     0,
        pointHoverRadius: 4,
        fill:            false,
        tension:         0.3,
      },
    ],
  };

  // ── Per platform chart data ──────────────────────────────────────────────
  const platformChartData = {
    labels,
    datasets: Object.entries(PLATFORM_COLORS).map(([key, colors]) => ({
      label:           PLATFORM_LABELS[key],
      data:            snapshots.map((s) => s.platforms?.[key]?.value ?? null),
      borderColor:     colors.border,
      backgroundColor: colors.bg,
      borderWidth:     2,
      pointRadius:     snapshots.length > 30 ? 0 : 3,
      pointHoverRadius: 5,
      fill:            false,
      tension:         0.3,
      spanGaps:        true,
    })),
  };

  const chartOptions = {
    responsive:          true,
    maintainAspectRatio: false,
    interaction: {
      mode:      "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color:    "#8fa3bf",
          boxWidth: 12,
          padding:  16,
          font:     { size: 11 },
        },
      },
      tooltip: {
        backgroundColor: "#1d3354",
        borderColor:     "rgba(255,255,255,0.1)",
        borderWidth:     1,
        titleColor:      "#e8edf5",
        bodyColor:       "#8fa3bf",
        padding:         10,
      },
    },
    scales: {
      x: {
        grid:  { color: "rgba(255,255,255,0.05)" },
        ticks: { color: "#5d7a9a", font: { size: 10 } },
      },
      y: {
        grid:  { color: "rgba(255,255,255,0.05)" },
        ticks: {
          color: "#5d7a9a",
          font:  { size: 10 },
          callback: (val) => val.toLocaleString(),
        },
      },
    },
  };

  return (
    <div className="bg-[#162741] border border-white/10 rounded-lg p-4">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs uppercase text-gray-400">P&L Over Time</h2>
        <div className="flex items-center gap-2">

          {/* Day range selector */}
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`text-[10px] px-2 py-1 rounded transition ${
                days === d
                  ? "bg-[#1a6bbc] text-white"
                  : "text-[#5d7a9a] hover:text-white"
              }`}
            >
              {d}D
            </button>
          ))}

          {/* Chart toggle */}
          <div className="flex bg-white/5 border border-white/10 rounded-lg overflow-hidden ml-2">
            <button
              onClick={() => setActiveChart("total")}
              className={`text-[10px] px-2 py-1 transition ${
                activeChart === "total"
                  ? "bg-[#1a6bbc] text-white"
                  : "text-[#5d7a9a] hover:text-white"
              }`}
            >
              Total
            </button>
            <button
              onClick={() => setActiveChart("platforms")}
              className={`text-[10px] px-2 py-1 transition ${
                activeChart === "platforms"
                  ? "bg-[#1a6bbc] text-white"
                  : "text-[#5d7a9a] hover:text-white"
              }`}
            >
              Platforms
            </button>
          </div>

          {/* Manual trigger */}
          <button
            onClick={handleTrigger}
            disabled={triggering}
            className="text-[#5d7a9a] hover:text-white transition p-1 rounded hover:bg-white/10"
            title="Take snapshot now"
          >
            <IconRefresh size={14} className={triggering ? "animate-spin" : ""} />
          </button>

        </div>
      </div>

      {/* Chart */}
      <div style={{ height: "220px" }}>
        {loading ? (
          <div className="h-full flex items-center justify-center text-[#5d7a9a] text-xs">
            Loading...
          </div>
        ) : snapshots.length === 0 ? (
          <div className="h-full border border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center gap-2">
            <p className="text-[#5d7a9a] text-xs">No snapshots yet</p>
            <button
              onClick={handleTrigger}
              disabled={triggering}
              className="text-xs bg-[#1a6bbc] hover:bg-[#2e82d8] text-white px-3 py-1.5 rounded-lg transition"
            >
              {triggering ? "Taking snapshot..." : "Take first snapshot"}
            </button>
          </div>
        ) : (
          <Line
            data={activeChart === "total" ? totalChartData : platformChartData}
            options={chartOptions}
          />
        )}
      </div>

      {snapshots.length > 0 && (
        <p className="text-[10px] text-[#5d7a9a] mt-3">
          {snapshots.length} snapshots · Total chart in AUD · Platform chart in local currency
        </p>
      )}

    </div>
  );
}