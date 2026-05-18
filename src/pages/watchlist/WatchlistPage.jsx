import { useState, useEffect } from "react";
import AppLayout from "../../components/layout/AppLayout";
import WatchlistHeader from "../../components/watchlist/WatchlistHeader";
import WatchlistCard from "../../components/watchlist/WatchlistCard";
import InfoBox from "../../components/watchlist/InfoBox";
import Modal from "../../components/ui/Modal";
import AddToWatchlistForm from "../../components/watchlist/AddToWatchlistForm";
import { getWatchlist, createWatchlistItem, deleteWatchlistItem, updateWatchlistItem, getWatchlistPrices } from "../../api/watchlist";

export default function WatchlistPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [prices, setPrices] = useState({});

 const fetchWatchlist = async () => {
  try {
    setLoading(true);
    const { data } = await getWatchlist();
    setItems(data);

    // Fetch prices after items load
    if (data.length > 0) {
      try {
        const { data: priceData } = await getWatchlistPrices();
        setPrices(priceData);
      } catch {
        // Prices failing shouldn't break the watchlist
      }
    }
  } catch (err) {
    setError("Failed to load watchlist");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => { fetchWatchlist(); }, []);

  const handleAdd = async (formData) => {
    setSaving(true);
    try {
      await createWatchlistItem(formData);
      setModalOpen(false);
      await fetchWatchlist();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add item");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteWatchlistItem(deleteTarget._id);
      setDeleteTarget(null);
      await fetchWatchlist();
    } catch (err) {
      alert("Failed to delete item");
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleAlert = async (item) => {
    try {
      await updateWatchlistItem(item._id, {
        alertTriggered: !item.alertTriggered,
      });
      await fetchWatchlist();
    } catch {
      // fail silently
    }
  };

  // Split into buy and sell
  const buyItems = items.filter((i) => i.action === "Buy");
  const sellItems = items.filter((i) => i.action === "Sell");

  // Find high priority sell items with alerts for InfoBox
  const highPrioritySells = sellItems.filter(
    (i) => i.priority === "High" && i.priceAlertThreshold
  );

  // Map API data to the shape WatchlistItem expects
  const mapItem = (item) => {
  const priceKey = `${item.exchange}:${item.symbol}`;
  const priceData = prices[priceKey];
  const livePrice = priceData?.price ?? null;

  // Check if alert has been triggered
  const alertHit = item.priceAlertThreshold && livePrice !== null
    ? item.alertDirection === "above"
      ? livePrice >= item.priceAlertThreshold
      : livePrice <= item.priceAlertThreshold
    : false;

  return {
    ...item,
    symbol:    item.symbol,
    name:      item.name || item.symbol,
    livePrice,
    dayPct:    priceData?.dayPercent ?? null,
    alert: item.priceAlertThreshold
      ? `${item.alertDirection === "above" ? "≥" : "≤"} ${item.priceAlertThreshold}`
      : "No alert",
    priority:  item.priority?.toLowerCase(),
    alertHit,
  };
};

  if (error) {
    return (
      <AppLayout title="Watchlist">
        <div className="text-center text-red-400 py-20">{error}</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Watchlist">
      <div className="space-y-6">

        <WatchlistHeader
          onAdd={() => setModalOpen(true)}
          loading={loading}
        />

        {loading && !items.length ? (
          <div className="text-center text-slate-400 py-20">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

            {/* BUY */}
            <div>
              <WatchlistCard
                title="Stocks to Buy"
                icon="ti ti-trending-up"
                color="text-emerald-400"
                stocks={buyItems.map(mapItem)}
                onDelete={(stock) => setDeleteTarget(stock)}
              />
              <InfoBox
                icon="ti ti-info-circle text-emerald-400"
                text="New NEPSE IPO listings appear here with no price until secondary market opens."
              />
            </div>

            {/* SELL */}
            <div className="space-y-5">
              <div>
                <WatchlistCard
                  title="Stocks to Sell"
                  icon="ti ti-trending-down"
                  color="text-red-400"
                  stocks={sellItems.map(mapItem)}
                  onDelete={(stock) => setDeleteTarget(stock)}
                />
                {highPrioritySells.length > 0 && (
                  <InfoBox
                    icon="ti ti-alert-triangle"
                    color="red"
                    text={`${highPrioritySells.map((i) => i.symbol).join(", ")} ${
                      highPrioritySells.length === 1 ? "is" : "are"
                    } HIGH priority with price alerts set.`}
                  />
                )}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Add Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add to Watchlist"
      >
        <AddToWatchlistForm
          onSubmit={handleAdd}
          onCancel={() => setModalOpen(false)}
          loading={saving}
        />
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Remove from Watchlist"
      >
        <p className="text-sm text-[#8fa3bf] mb-6">
          Remove{" "}
          <span className="text-white font-semibold">{deleteTarget?.symbol}</span>{" "}
          from your watchlist?
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setDeleteTarget(null)}
            className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-[#8fa3bf] text-sm font-medium rounded-lg py-2.5 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 bg-red-500/80 hover:bg-red-500 disabled:opacity-60 text-white text-sm font-semibold rounded-lg py-2.5 transition"
          >
            {deleting ? "Removing..." : "Remove"}
          </button>
        </div>
      </Modal>

    </AppLayout>
  );
}