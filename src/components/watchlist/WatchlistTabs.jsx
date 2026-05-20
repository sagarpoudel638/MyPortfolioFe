// src/components/watchlist/WatchlistTabs.jsx
import WatchlistItem from "./WatchlistItem";

export default function WatchlistTabs({
  activeTab, onTabChange, buyItems, sellItems, onEdit, onDelete,
}) {
  const tabs = [
    { key: "Buy",  label: "Buy",  count: buyItems.length,  color: "text-emerald-400" },
    { key: "Sell", label: "Sell", count: sellItems.length, color: "text-red-400"     },
  ];

  const activeItems = activeTab === "Buy" ? buyItems : sellItems;

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === tab.key
                ? tab.key === "Buy"
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  : "bg-red-500/15 text-red-400 border border-red-500/30"
                : "bg-white/5 text-[#8fa3bf] border border-white/10 hover:bg-white/10"
            }`}
          >
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              activeTab === tab.key
                ? tab.key === "Buy"
                  ? "bg-emerald-500/20"
                  : "bg-red-500/20"
                : "bg-white/10"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Items */}
      {activeItems.length === 0 ? (
        <div className="text-center text-[#5d7a9a] text-sm py-16 border border-dashed border-white/10 rounded-xl">
          No {activeTab.toLowerCase()} items yet
        </div>
      ) : (
        <div className="space-y-3">
          {activeItems.map((item) => (
            <WatchlistItem
              key={item._id}
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}