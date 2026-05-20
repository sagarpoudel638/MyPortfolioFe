import { useState, useEffect, useCallback } from "react";
import AppLayout from "../../components/layout/AppLayout";
import Modal from "../../components/ui/Modal";
import AddToWatchlistForm from "../../components/watchlist/AddToWatchlistForm";
import WatchlistTabs from "../../components/watchlist/WatchlistTabs";
import { IconPlus, IconRefresh } from "@tabler/icons-react";
import {
  getEnrichedWatchlist, createWatchlistItem,
  updateWatchlistItem, deleteWatchlistItem,
} from "../../api/watchlist";

export default function WatchlistPage() {
  const [items, setItems]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [activeTab, setActiveTab] = useState("Buy");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [saving, setSaving]       = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]   = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getEnrichedWatchlist();
      setItems(data);
    } catch {
      setError("Failed to load watchlist");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, []);

  const buyItems  = items.filter((i) => i.action === "Buy");
  const sellItems = items.filter((i) => i.action === "Sell");

  const handleAdd = async (formData) => {
    setSaving(true);
    try {
      await createWatchlistItem(formData);
      setModalOpen(false);
      await fetchItems();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add item");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (formData) => {
    setSaving(true);
    try {
      await updateWatchlistItem(editTarget._id, formData);
      setEditTarget(null);
      setModalOpen(false);
      await fetchItems();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteWatchlistItem(deleteTarget._id);
      setDeleteTarget(null);
      await fetchItems();
    } catch {
      alert("Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const openEdit = (item) => {
    setEditTarget(item);
    setModalOpen(true);
  };

  if (error) {
    return (
      <AppLayout title="Watchlist">
        <div className="text-center text-red-400 py-20">{error}</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Watchlist"
      actions={
        <div className="flex items-center gap-3">
          <button
            onClick={fetchItems}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-sm disabled:opacity-50"
          >
            <IconRefresh size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            onClick={() => { setEditTarget(null); setModalOpen(true); }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#1a6bbc] hover:bg-[#2e82d8] text-white text-sm font-medium transition"
          >
            <IconPlus size={16} />
            Add to Watchlist
          </button>
        </div>
      }
    >
      {loading && !items.length ? (
        <div className="text-center text-slate-400 py-20">Loading...</div>
      ) : (
        <WatchlistTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          buyItems={buyItems}
          sellItems={sellItems}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
        />
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditTarget(null); }}
        title={editTarget ? `Edit ${editTarget.symbol}` : "Add to Watchlist"}
      >
        <AddToWatchlistForm
          ticker={editTarget?.symbol}
          exchange={editTarget?.exchange}
          initial={editTarget}
          onSubmit={editTarget ? handleEdit : handleAdd}
          onCancel={() => { setModalOpen(false); setEditTarget(null); }}
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