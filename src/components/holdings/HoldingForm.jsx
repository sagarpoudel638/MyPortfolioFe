// src/components/holdings/HoldingForm.jsx
import { useState, useEffect, useRef } from "react";
import { IconAlertTriangle, IconCheck, IconLoader2 } from "@tabler/icons-react";
import { verifyTicker } from "../../api/prices";

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

const todayStr = () => new Date().toISOString().split("T")[0];

export default function HoldingForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm]           = useState(initial || EMPTY);
  const [errors, setErrors]       = useState({});
  // ticker verification: "idle" | "checking" | "found" | "notfound"
  const [tickerStatus, setTickerStatus] = useState("idle");
  const verifyTimer = useRef(null);

  // When market changes, auto-fill currency and reset ticker status
  useEffect(() => {
    if (form.market) {
      setForm((f) => ({
        ...f,
        currency: CURRENCY_BY_MARKET[form.market] || f.currency,
      }));
      setTickerStatus("idle");
    }
  }, [form.market]);

  const set = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: null }));
    if (field === "ticker") setTickerStatus("idle");
  };

  // Verify ticker after user stops typing (500ms debounce)
  const handleTickerBlur = () => {
    const ticker   = form.ticker.trim().toUpperCase();
    const exchange = form.market;
    if (!ticker || !exchange) return;

    clearTimeout(verifyTimer.current);
    setTickerStatus("checking");

    verifyTimer.current = setTimeout(async () => {
      try {
        const { data } = await verifyTicker(ticker, exchange);
        setTickerStatus(data.found ? "found" : "notfound");
      } catch {
        setTickerStatus("notfound");
      }
    }, 0); // fires immediately on blur, not on keystroke
  };

  const validate = () => {
    const e = {};
    if (!form.market)       e.market       = "Required";
    if (!form.ticker)       e.ticker       = "Required";
    if (!form.name)         e.name         = "Required";
    if (!form.qty)          e.qty          = "Required";
    if (form.buyPrice === "") e.buyPrice   = "Required";
    if (!form.purchaseDate) {
      e.purchaseDate = "Required";
    } else if (form.purchaseDate > todayStr()) {
      e.purchaseDate = "Cannot be in the future";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      exchange:        form.market,
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

  // Ticker status icon + badge
  const TickerStatusBadge = () => {
    if (tickerStatus === "idle")     return null;
    if (tickerStatus === "checking") return (
      <span className="flex items-center gap-1 text-[10px] text-[#5d7a9a]">
        <IconLoader2 size={11} className="animate-spin" /> Checking…
      </span>
    );
    if (tickerStatus === "found") return (
      <span className="flex items-center gap-1 text-[10px] text-emerald-400">
        <IconCheck size={11} /> Verified
      </span>
    );
    if (tickerStatus === "notfound") return (
      <span className="flex items-center gap-1 text-[10px] text-amber-400">
        <IconAlertTriangle size={11} /> Not found in price source
      </span>
    );
    return null;
  };

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
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-semibold text-[#8fa3bf] uppercase tracking-wide">
              Ticker
            </label>
            <div className="flex items-center gap-2">
              <TickerStatusBadge />
              {errors.ticker && (
                <span className="text-[10px] text-red-400">{errors.ticker}</span>
              )}
            </div>
          </div>
          <input
            type="text"
            value={form.ticker}
            onChange={(e) => set("ticker", e.target.value.toUpperCase())}
            onBlur={handleTickerBlur}
            placeholder="e.g. NABIL"
            className={`${inputClass("ticker")} ${
              tickerStatus === "notfound" ? "border-amber-500/40" : ""
            }`}
          />
          {tickerStatus === "notfound" && (
            <p className="text-[10px] text-amber-400 mt-1 flex items-center gap-1">
              <IconAlertTriangle size={10} />
              Price data not found — you can still save, but live tracking may not work.
            </p>
          )}
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
          max={todayStr()}
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
