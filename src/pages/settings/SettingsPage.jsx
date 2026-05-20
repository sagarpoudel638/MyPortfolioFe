// src/pages/settings/SettingsPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconUser, IconShield, IconBell, IconTrash,
  IconCheck, IconLoader2, IconChevronRight,
} from "@tabler/icons-react";
import AppLayout from "../../components/layout/AppLayout";
import { useAuth } from "../../context/AuthContext";
import {
  getProfile, updateProfile,
  updateNotifications, deleteAccount,
} from "../../api/settings";
import { changePassword } from "../../api/auth";

const TABS = [
  { key: "profile",       label: "Profile",       icon: <IconUser size={15} />    },
  { key: "security",      label: "Security",       icon: <IconShield size={15} />  },
  { key: "notifications", label: "Notifications",  icon: <IconBell size={15} />    },
  { key: "danger",        label: "Danger Zone",    icon: <IconTrash size={15} />   },
];

// ── Reusable save button ─────────────────────────────────────────────────────
function SaveButton({ loading, saved }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex items-center gap-2 bg-[#1a6bbc] hover:bg-[#2e82d8] disabled:opacity-60 text-white text-sm font-semibold px-5 py-2 rounded-lg transition"
    >
      {loading ? (
        <><IconLoader2 size={15} className="animate-spin" /> Saving...</>
      ) : saved ? (
        <><IconCheck size={15} /> Saved</>
      ) : "Save Changes"}
    </button>
  );
}

// ── Toggle component ─────────────────────────────────────────────────────────
function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div>
        <p className="text-sm text-white">{label}</p>
        {description && <p className="text-xs text-[#5d7a9a] mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-10 h-5 rounded-full transition-all relative ${
          checked ? "bg-[#1a6bbc]" : "bg-white/10"
        }`}
      >
        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${
          checked ? "left-5" : "left-0.5"
        }`} />
      </button>
    </div>
  );
}

// ── PROFILE TAB ──────────────────────────────────────────────────────────────
function ProfileTab({ profile, onSaved }) {
  const [name, setName]               = useState(profile.name || "");
  const [baseCurrency, setBase]       = useState(profile.baseCurrency || "AUD");
  const [useManualFx, setUseManual]   = useState(
    profile.manualFxRates?.audNpr !== null || profile.manualFxRates?.audUsd !== null
  );
  const [audNpr, setAudNpr]           = useState(profile.manualFxRates?.audNpr || "");
  const [audUsd, setAudUsd]           = useState(profile.manualFxRates?.audUsd || "");
  const [loading, setLoading]         = useState(false);
  const [saved, setSaved]             = useState(false);
  const [error, setError]             = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await updateProfile({
        name,
        baseCurrency,
        manualFxRates: {
          audNpr: useManualFx && audNpr ? parseFloat(audNpr) : null,
          audUsd: useManualFx && audUsd ? parseFloat(audUsd) : null,
        },
      });
      setSaved(true);
      onSaved({ name });
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#5d7a9a] focus:outline-none focus:border-[#2e82d8] transition";
  const selectClass = "w-full bg-[#162741] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#2e82d8] transition";
  const Label = ({ children }) => (
    <label className="text-[11px] font-semibold text-[#8fa3bf] uppercase tracking-wide mb-1 block">
      {children}
    </label>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <Label>Full Name</Label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <Label>Email Address</Label>
        <input
          type="email"
          value={profile.email}
          readOnly
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-[#5d7a9a] cursor-not-allowed"
        />
        <p className="text-[10px] text-[#5d7a9a] mt-1">Email cannot be changed.</p>
      </div>

      <div>
        <Label>Base Currency</Label>
        <select
          value={baseCurrency}
          onChange={(e) => setBase(e.target.value)}
          className={selectClass}
        >
          <option value="AUD">AUD — Australian Dollar</option>
          <option value="USD">USD — US Dollar</option>
          <option value="NPR">NPR — Nepalese Rupee</option>
        </select>
        <p className="text-[10px] text-[#5d7a9a] mt-1">
          All portfolio totals are converted to this currency.
        </p>
      </div>

      {/* Manual FX Rates */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <Toggle
          checked={useManualFx}
          onChange={setUseManual}
          label="Use manual FX rates"
          description="Override live exchange rates with your own values"
        />

        {useManualFx && (
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <Label>1 AUD = ? NPR</Label>
              <input
                type="number"
                value={audNpr}
                onChange={(e) => setAudNpr(e.target.value)}
                placeholder="e.g. 90.5"
                step="any"
                className={inputClass}
              />
            </div>
            <div>
              <Label>1 AUD = ? USD</Label>
              <input
                type="number"
                value={audUsd}
                onChange={(e) => setAudUsd(e.target.value)}
                placeholder="e.g. 0.635"
                step="any"
                className={inputClass}
              />
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      <SaveButton loading={loading} saved={saved} />
    </form>
  );
}

// ── SECURITY TAB ─────────────────────────────────────────────────────────────
function SecurityTab() {
  const [form, setForm]     = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [error, setError]   = useState(null);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (form.newPassword !== form.confirm) {
      setError("New passwords do not match");
      return;
    }
    if (form.newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      await changePassword(form.currentPassword, form.newPassword);
      setSaved(true);
      setForm({ currentPassword: "", newPassword: "", confirm: "" });
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#5d7a9a] focus:outline-none focus:border-[#2e82d8] transition";
  const Label = ({ children }) => (
    <label className="text-[11px] font-semibold text-[#8fa3bf] uppercase tracking-wide mb-1 block">
      {children}
    </label>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Current Password</Label>
        <input
          type="password"
          value={form.currentPassword}
          onChange={(e) => set("currentPassword", e.target.value)}
          placeholder="••••••••"
          required
          className={inputClass}
        />
      </div>

      <div>
        <Label>New Password</Label>
        <input
          type="password"
          value={form.newPassword}
          onChange={(e) => set("newPassword", e.target.value)}
          placeholder="Min. 8 characters"
          required
          className={inputClass}
        />
      </div>

      <div>
        <Label>Confirm New Password</Label>
        <input
          type="password"
          value={form.confirm}
          onChange={(e) => set("confirm", e.target.value)}
          placeholder="Repeat new password"
          required
          className={inputClass}
        />
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <SaveButton loading={loading} saved={saved} />
    </form>
  );
}

// ── NOTIFICATIONS TAB ────────────────────────────────────────────────────────
function NotificationsTab({ notifications }) {
  const [prefs, setPrefs]   = useState(notifications);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [error, setError]   = useState(null);

  const toggle = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await updateNotifications(prefs);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <Toggle
          checked={prefs.stopLossAlerts}
          onChange={() => toggle("stopLossAlerts")}
          label="Stop-loss alerts"
          description="Notify when a holding falls below your stop-loss price"
        />
        <Toggle
          checked={prefs.targetHitAlerts}
          onChange={() => toggle("targetHitAlerts")}
          label="Target hit alerts"
          description="Notify when a holding reaches your target price"
        />
        <Toggle
          checked={prefs.priceAlerts}
          onChange={() => toggle("priceAlerts")}
          label="Watchlist price alerts"
          description="Notify when a watchlist item crosses its alert threshold"
        />
        <Toggle
          checked={prefs.dailySummary}
          onChange={() => toggle("dailySummary")}
          label="Daily summary"
          description="Receive a daily email summary of your portfolio performance"
        />
      </div>

      <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg px-4 py-3">
        <p className="text-xs text-amber-400">
          Notifications are being built — toggles are saved but alerts are not yet active. Coming in the next version.
        </p>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <SaveButton loading={loading} saved={saved} />
    </form>
  );
}

// ── DANGER ZONE TAB ──────────────────────────────────────────────────────────
function DangerTab() {
  const { logoutUser } = useAuth();
  const navigate       = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [step, setStep]         = useState(1); // 1 = warning, 2 = confirm

  const handleDelete = async (e) => {
    e.preventDefault();
    setError(null);

    if (confirm !== "DELETE") {
      setError('Please type "DELETE" to confirm');
      return;
    }

    setLoading(true);
    try {
      await deleteAccount(password);
      logoutUser();
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#5d7a9a] focus:outline-none focus:border-red-500/50 transition";
  const Label = ({ children }) => (
    <label className="text-[11px] font-semibold text-[#8fa3bf] uppercase tracking-wide mb-1 block">
      {children}
    </label>
  );

  return (
    <div className="space-y-5">
      <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-red-400 mb-2">Delete Account</h3>
        <p className="text-xs text-[#8fa3bf] leading-relaxed">
          This will permanently delete your account, all holdings, watchlist items,
          and portfolio snapshots. This action cannot be undone.
        </p>
      </div>

      {step === 1 ? (
        <button
          onClick={() => setStep(2)}
          className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-medium px-5 py-2 rounded-lg transition"
        >
          I want to delete my account
        </button>
      ) : (
        <form onSubmit={handleDelete} className="space-y-4">
          <div>
            <Label>Current Password</Label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              className={inputClass}
            />
          </div>

          <div>
            <Label>Type DELETE to confirm</Label>
            <input
              type="text"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="DELETE"
              required
              className={inputClass}
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => { setStep(1); setError(null); }}
              className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-[#8fa3bf] text-sm font-medium rounded-lg py-2 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-red-500/80 hover:bg-red-500 disabled:opacity-60 text-white text-sm font-semibold rounded-lg py-2 transition"
            >
              {loading ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// ── MAIN SETTINGS PAGE ───────────────────────────────────────────────────────
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile]     = useState(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    getProfile()
      .then(({ data }) => setProfile(data))
      .finally(() => setLoading(false));
  }, []);

  const handleProfileSaved = ({ name }) => {
    setProfile((p) => ({ ...p, name }));
    // Update localStorage so sidebar reflects new name
    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    localStorage.setItem("user", JSON.stringify({ ...stored, name }));
  };

  if (loading) {
    return (
      <AppLayout title="Settings">
        <div className="text-center text-slate-400 py-20">Loading...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Settings">
      <div className="flex flex-col md:flex-row gap-6">

        {/* Sidebar tabs */}
        <div className="md:w-48 shrink-0">
  <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible bg-white/5 border border-white/10 rounded-xl p-1 md:p-0">
    {TABS.map((tab) => (
      <button
        key={tab.key}
        onClick={() => setActiveTab(tab.key)}
        className={`flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 text-sm rounded-lg md:rounded-none transition whitespace-nowrap flex-shrink-0
          md:border-b md:border-white/5 md:last:border-0 ${
          activeTab === tab.key
            ? "bg-[#1a6bbc]/20 text-white md:border-l-2 md:border-l-[#1a6bbc]"
            : "text-[#8fa3bf] hover:bg-white/5 hover:text-white"
        }`}
      >
        {tab.icon}
        {tab.label}
        {activeTab === tab.key && (
          <IconChevronRight size={14} className="ml-auto hidden md:block" />
        )}
      </button>
    ))}
  </div>
</div>

        {/* Content panel */}
        <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-white mb-5 pb-3 border-b border-white/10">
            {TABS.find((t) => t.key === activeTab)?.label}
          </h2>

          {activeTab === "profile" && (
            <ProfileTab profile={profile} onSaved={handleProfileSaved} />
          )}
          {activeTab === "security" && <SecurityTab />}
          {activeTab === "notifications" && (
            <NotificationsTab notifications={profile.notifications} />
          )}
          {activeTab === "danger" && <DangerTab />}
        </div>

      </div>
    </AppLayout>
  );
}