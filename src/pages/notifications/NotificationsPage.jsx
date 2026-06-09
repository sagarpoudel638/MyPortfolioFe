// src/pages/notifications/NotificationsPage.jsx
import { useEffect, useState, useCallback } from "react";
import AppLayout from "../../components/layout/AppLayout";
import {
  IconBell, IconCheck, IconChecks, IconTrendingUp,
  IconChartBar, IconRefresh, IconBellOff,
} from "@tabler/icons-react";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "../../api/notifications";
import { useNotifications } from "../../context/NotificationContext";

const TYPE_META = {
  price_alert:       { icon: <IconTrendingUp size={16} className="text-[#00c896]" />,  label: "Price Alert"       },
  portfolio_summary: { icon: <IconChartBar   size={16} className="text-[#2e82d8]" />,  label: "Portfolio Summary" },
};

function timeAgo(dateStr) {
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)  return "just now";
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function NotificationsPage() {
  const { setUnreadCount: setGlobalUnread } = useNotifications();
  const [notifications, setNotifs] = useState([]);
  const [unreadCount, setUnread]   = useState(0);
  const [loading, setLoading]      = useState(true);
  const [error, setError]          = useState(null);
  const [filter, setFilter]        = useState("all"); // all | unread

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getNotifications();
      setNotifs(data.notifications);
      setUnread(data.unreadCount);
    } catch {
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, []);

  const handleMarkOne = async (id) => {
    await markAsRead(id).catch(console.error);
    setNotifs((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
    setUnread((c) => { const next = Math.max(0, c - 1); setGlobalUnread(next); return next; });
  };

  const handleMarkAll = async () => {
    await markAllAsRead().catch(console.error);
    setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnread(0);
    setGlobalUnread(0);
  };

  const displayed = filter === "unread"
    ? notifications.filter((n) => !n.isRead)
    : notifications;

  return (
    <AppLayout
      title="Notifications"
      actions={
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAll}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-sm transition"
            >
              <IconChecks size={15} />
              Mark all read
            </button>
          )}
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-sm disabled:opacity-50 transition"
          >
            <IconRefresh size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      }
    >
      {/* Filter tabs */}
      <div className="flex items-center gap-1 mb-4">
        {["all", "unread"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition capitalize ${
              filter === tab
                ? "bg-[#1a6bbc] text-white"
                : "bg-white/5 text-[#8fa3bf] hover:bg-white/10"
            }`}
          >
            {tab}
            {tab === "unread" && unreadCount > 0 && (
              <span className="ml-2 bg-[#00c896] text-[#0d1f33] text-[10px] font-bold rounded-full px-1.5">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {error ? (
        <div className="text-center text-red-400 py-20">{error}</div>
      ) : loading ? (
        <div className="text-center text-slate-400 py-20">Loading...</div>
      ) : displayed.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-[#5d7a9a]">
          <IconBellOff size={40} className="mb-4 opacity-40" />
          <p className="text-sm">
            {filter === "unread" ? "No unread notifications" : "No notifications yet"}
          </p>
          <p className="text-xs mt-1 opacity-60">
            Price alerts will appear here when your targets are hit
          </p>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          {displayed.map((n, i) => {
            const meta = TYPE_META[n.type] ?? {
              icon:  <IconBell size={16} className="text-[#8fa3bf]" />,
              label: n.type,
            };

            return (
              <div
                key={n._id}
                className={`flex items-start gap-4 px-5 py-4 transition ${
                  i < displayed.length - 1 ? "border-b border-white/5" : ""
                } ${n.isRead ? "" : "bg-[#1a6bbc]/5"}`}
              >
                {/* Icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  n.isRead ? "bg-white/5" : "bg-[#1a6bbc]/20"
                }`}>
                  {meta.icon}
                </div>

                {/* Body */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-semibold uppercase tracking-wide ${
                      n.type === "price_alert" ? "text-[#00c896]" : "text-[#2e82d8]"
                    }`}>
                      {meta.label}
                    </span>
                    {n.ticker && (
                      <span className="text-[10px] bg-white/10 text-[#8fa3bf] px-1.5 py-0.5 rounded font-mono">
                        {n.ticker}
                      </span>
                    )}
                    {!n.isRead && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00c896]" />
                    )}
                  </div>
                  <p className="text-sm text-white leading-relaxed">{n.message}</p>
                  <p className="text-xs text-[#5d7a9a] mt-1">{timeAgo(n.createdAt)}</p>
                </div>

                {/* Mark read */}
                {!n.isRead && (
                  <button
                    onClick={() => handleMarkOne(n._id)}
                    className="shrink-0 text-[#5d7a9a] hover:text-[#00c896] transition mt-1"
                    title="Mark as read"
                  >
                    <IconCheck size={15} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
}
