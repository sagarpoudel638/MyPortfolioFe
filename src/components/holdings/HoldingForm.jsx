// src/components/holdings/HoldingForm.jsx
import { useState, useEffect } from "react";

const MARKETS = ["ASX", "NYSE", "NASDAQ", "NEPSE"];

const CURRENCY_BY_MARKET = {
  ASX:    "AUD",
  NYSE:   "USD",
  NASDAQ: "USD",
  NEPSE:  "NPR",
};

const EMPTY = {
  market:        "",
  broker:        "",
  currency:      "",
  ticker:        "",
  name:          "",
  qty:           "",
  buyPrice:      "",
  purchaseDate:  "",
  isFreeAllotment: false,
  isTracking:    true,
  notes:         "",
};

export default function HoldingForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(initial || EMPTY);
  const [errors, setErrors] = useState({});

  // When market changes, auto-fill currency
  useEffect(() => {
    if (form.market) {
      setForm((f) => ({
        ...f,
        currency: CURRENCY_BY_MARKET[form.market] || f.currency,
      }));
    }
  }, [form.market]);

  const set = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.market)       e.market       = "Required";
    if (!form.ticker)       e.ticker       = "Required";
    if (!form.name)         e.name         = "Required";
    if (!form.qty)          e.qty          = "Required";
    if (form.buyPrice === "") e.buyPrice   = "Required";
    if (!form.purchaseDate) e.purchaseDate = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      exchange:        form.market,  // backend uses exchange as the market key
      broker:          form.broker,
      currency:        form.currency,
      ticker:          form.ticker.toUpperCase().trim(),
      name:            form.name,
      qty:             parseFloat(form.qty),
      buyPrice:        parseFloat(form.buyPrice),
      purchaseDate:    form.purchaseDate,
      isFreeAllotment: form.isFreeAllotment,
      isTracking:      form.isTracking,
      notes:           form.notes,
    });
  };


  const inputClass = (field) =>
    `w-full bg-white/5 border ${errors[field] ? "border-red-500/50" : "border-white/10"} 
     rounded-lg px-3 py-2 text-xs text-white placeholder:text-[#5d7a9a] 
     focus:outline-none focus:border-[#2e82d8] transition`;

  const selectClass = (field) =>
    `w-full bg-[#162741] border ${errors[field] ? "border-red-500/50" : "border-white/10"} 
     rounded-lg px-3 py-2 text-xs text-white 
     focus:outline-none focus:border-[#2e82d8] transition`;

  const Label = ({ children, error }) => (
    <div className="flex items-center justify-between mb-1">
      <label className="text-[11px] font-semibold text-[#8fa3bf] uppercase tracking-wide">
        {children}
      </label>
      {error && <span className="text-[10px] text-red-400">{error}</span>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      {/* Row 1: Market + Broker */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label error={errors.market}>Market</Label>
          <select
            value={form.market}
            onChange={(e) => set("market", e.target.value)}
            className={selectClass("market")}
          >
            <option value="">Select market</option>
            {MARKETS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <Label>Broker (optional)</Label>
          <input
            type="text"
            value={form.broker}
            onChange={(e) => set("broker", e.target.value)}
            placeholder="e.g. CommBank, Webull"
            className={inputClass("broker")}
          />
        </div>
      </div>

      {/* Row 2: Ticker + Name */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label error={errors.ticker}>Ticker</Label>
          <input
            type="text"
            value={form.ticker}
            onChange={(e) => set("ticker", e.target.value.toUpperCase())}
            placeholder="e.g. NABIL"
            className={inputClass("ticker")}
          />
        </div>

        <div>
          <Label error={errors.name}>Company / Fund Name</Label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Nabil Bank Ltd"
            className={inputClass("name")}
          />
        </div>
      </div>

      {/* Row 3: Qty + Buy Price + Currency */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label error={errors.qty}>Quantity</Label>
          <input
            type="number"
            value={form.qty}
            onChange={(e) => set("qty", e.target.value)}
            placeholder="0.00"
            step="any"
            min="0"
            className={inputClass("qty")}
          />
        </div>

        <div>
          <Label error={errors.buyPrice}>Buy Price</Label>
          <input
            type="number"
            value={form.buyPrice}
            onChange={(e) => set("buyPrice", e.target.value)}
            placeholder="0.00"
            step="any"
            min="0"
            className={inputClass("buyPrice")}
          />
        </div>

        <div>
          <Label>Currency</Label>
          <input
            type="text"
            value={form.currency}
            readOnly
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-[#5d7a9a] cursor-not-allowed"
          />
        </div>
      </div>

      {/* Row 4: Purchase Date */}
      <div>
        <Label error={errors.purchaseDate}>Purchase Date</Label>
        <input
          type="date"
          value={form.purchaseDate}
          onChange={(e) => set("purchaseDate", e.target.value)}
          className={inputClass("purchaseDate")}
          style={{ colorScheme: "dark" }}
        />
      </div>

      {/* Row 5: Notes */}
      <div>
        <Label>Notes (optional)</Label>
        <input
          type="text"
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="Any notes about this holding"
          className={inputClass("notes")}
        />
      </div>

      {/* Row 6: Flags */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-xs text-[#8fa3bf] cursor-pointer">
          <input
            type="checkbox"
            checked={form.isFreeAllotment}
            onChange={(e) => set("isFreeAllotment", e.target.checked)}
            className="accent-[#00c896]"
          />
          Free allotment (excluded from return%)
        </label>

        <label className="flex items-center gap-2 text-xs text-[#8fa3bf] cursor-pointer">
          <input
            type="checkbox"
            checked={form.isTracking}
            onChange={(e) => set("isTracking", e.target.checked)}
            className="accent-[#00c896]"
          />
          Track this holding
        </label>
      </div>

      {/* Invested preview */}
      {form.qty && form.buyPrice && !form.isFreeAllotment && (
        <div className="bg-[#00c896]/5 border border-[#00c896]/20 rounded-lg px-4 py-3">
          <div className="flex justify-between text-xs">
            <span className="text-[#5d7a9a]">Invested amount</span>
            <span className="font-mono font-semibold text-[#00c896]">
              {form.currency} {(parseFloat(form.qty) * parseFloat(form.buyPrice)).toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* Buttons */}
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
          {loading ? "Saving..." : initial ? "Save Changes" : "Add Holding"}
        </button>
      </div>

    </form>
  );
}