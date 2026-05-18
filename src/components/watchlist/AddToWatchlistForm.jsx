// src/components/watchlist/AddToWatchlistForm.jsx
import { useState } from "react";

const EXCHANGES = ["ASX", "NYSE", "NASDAQ", "NEPSE"];

export default function AddToWatchlistForm({ ticker, exchange, onSubmit, onCancel, loading }) {
  const isFromHolding = !!ticker; // came from eye button — ticker/exchange pre-filled

  const [form, setForm] = useState({
    symbol:              ticker || "",
    exchange:            exchange || "",
    action:              "Buy",
    priority:            "Medium",
    notes:               "",
    priceAlertThreshold: "",
    alertDirection:      "",
  });
  const [error, setError] = useState(null);

  const set = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setError(null);
  };

  const validate = () => {
    if (!form.symbol)   { setError("Ticker is required");   return false; }
    if (!form.exchange) { setError("Exchange is required"); return false; }
    if (form.priceAlertThreshold && !form.alertDirection) {
      setError("Select alert direction (above/below)"); return false;
    }
    if (form.alertDirection && !form.priceAlertThreshold) {
      setError("Enter a price threshold for the alert"); return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      symbol:              form.symbol.toUpperCase().trim(),
      exchange:            form.exchange,
      action:              form.action,
      priority:            form.priority,
      notes:               form.notes,
      priceAlertThreshold: form.priceAlertThreshold ? parseFloat(form.priceAlertThreshold) : null,
      alertDirection:      form.alertDirection || null,
    });
  };

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-[#5d7a9a] focus:outline-none focus:border-[#2e82d8] transition";
  const selectClass =
    "w-full bg-[#162741] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2e82d8] transition";
  const Label = ({ children }) => (
    <label className="text-[11px] font-semibold text-[#8fa3bf] uppercase tracking-wide mb-1 block">
      {children}
    </label>
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      {/* If from holding — show ticker preview. If manual — show inputs */}
      {isFromHolding ? (
        <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold font-mono text-[#2e82d8]">{ticker}</div>
            <div className="text-[10px] text-[#5d7a9a] mt-0.5">{exchange}</div>
          </div>
          <div className="text-[10px] text-[#5d7a9a]">Adding to watchlist</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Ticker</Label>
            <input
              type="text"
              value={form.symbol}
              onChange={(e) => set("symbol", e.target.value.toUpperCase())}
              placeholder="e.g. NABIL"
              className={inputClass}
            />
          </div>
          <div>
            <Label>Exchange</Label>
            <select
              value={form.exchange}
              onChange={(e) => set("exchange", e.target.value)}
              className={selectClass}
            >
              <option value="">Select exchange</option>
              {EXCHANGES.map((ex) => (
                <option key={ex} value={ex}>{ex}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Action + Priority */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Action</Label>
          <select value={form.action} onChange={(e) => set("action", e.target.value)} className={selectClass}>
            <option value="Buy">Buy</option>
            <option value="Sell">Sell</option>
          </select>
        </div>
        <div>
          <Label>Priority</Label>
          <select value={form.priority} onChange={(e) => set("priority", e.target.value)} className={selectClass}>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Price Alert */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Alert Price (optional)</Label>
          <input
            type="number"
            value={form.priceAlertThreshold}
            onChange={(e) => set("priceAlertThreshold", e.target.value)}
            placeholder="e.g. 500"
            step="any"
            min="0"
            className={inputClass}
          />
        </div>
        <div>
          <Label>Alert Direction</Label>
          <select value={form.alertDirection} onChange={(e) => set("alertDirection", e.target.value)} className={selectClass}>
            <option value="">No alert</option>
            <option value="above">Above price</option>
            <option value="below">Below price</option>
          </select>
        </div>
      </div>

      {/* Notes */}
      <div>
        <Label>Notes (optional)</Label>
        <input
          type="text"
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="Why are you watching this?"
          className={inputClass}
        />
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 text-xs text-red-400">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-[#8fa3bf] text-sm font-medium rounded-lg py-2.5 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-[#1a6bbc] hover:bg-[#2e82d8] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg py-2.5 transition"
        >
          {loading ? "Adding..." : "Add to Watchlist"}
        </button>
      </div>

    </form>
  );
}