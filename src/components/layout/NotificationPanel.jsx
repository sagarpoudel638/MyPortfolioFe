// components/layout/NotificationPanel.jsx
import { useEffect, useRef, useState } from "react";
import { IconBell, IconCheck, IconChecks, IconTrendingUp, IconChartBar } from "@tabler/icons-react";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "../../api/notifications";

const TYPE_ICON = {
  price_alert:       <IconTrendingUp size={14} className="text-[#00c896]" />,
  portfolio_summary: <IconChartBar   size={14} className="text-[#2e82d8]" />,
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)   return "just now";
  if (mins  < 60)  return `${mins}m ago`;
  if (hours < 24)  return `${hours}h ago`;
  return `${days}d ago`;
}

export default function NotificationPanel() {
  const [open, setOpen]             = useState(false);
  const [notifications, setNotifs]  = useState([]);
  const [unreadCount, setUnread]    = useState(0);
  const [loading, setLoading]       = useState(false);
  const panelRef                    = useRef(null);

  // Fetch on open
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    getNotifications()
      .then(({ data }) => {
        setNotifs(data.notifications);
        setUnread(data.unreadCount);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [open]);

  // Poll unread count every 60s (even when panel is closed)
  useEffect(() => {
    const fetch = () =>
      getNotifications()
        .then(({ data }) => setUnread(data.unreadCount))
        .catch(() => {});
    fetch();
    const id = setInterval(fetch, 60000);
    return () => clearInterval(id);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleMarkOne = async (id) => {
    await markAsRead(id).catch(console.error);
    setNotifs((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
    setUnread((c) => Math.max(0, c - 1));
  };

  const handleMarkAll = async () => {
    await markAllAsRead().catch(console.error);
    setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnread(0);
  };

  return (
    <div ref={panelRef} className="relative">

      {/* Bell button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative flex items-center gap-2 px-5 py-2 w-full text-sm text-gray-300 hover:bg-white/5 transition"
      >
        <IconBell size={16} />
        Notifications
        {unreadCount > 0 && (
          <span className="ml-auto bg-[#00c896] text-[#0d1f33] text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-none">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute left-full top-0 ml-2 w-80 bg-[#1d3354] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <span className="text-xs font-semibold text-white uppercase tracking-wide">
              Notifications
            </span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAll}
                className="flex items-center gap-1 text-[10px] text-[#2e82d8] hover:text-white transition"
              >
                <IconChecks size={12} />
                Mark all read
              </button>
            )}
          </div>

          {/* Body */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <p className="text-xs text-[#5d7a9a] text-center py-8">Loading...</p>
            ) : notifications.length === 0 ? (
              <p className="text-xs text-[#5d7a9a] text-center py-8">No notifications yet</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-white/5 transition ${
                    n.isRead ? "opacity-50" : "bg-white/5"
                  }`}
                >
                  {/* Icon */}
                  <div className="mt-0.5 shrink-0">
                    {TYPE_ICON[n.type] ?? <IconBell size={14} className="text-[#8fa3bf]" />}
                  </div>

                  {/* Message */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white leading-relaxed">{n.message}</p>
                    <p className="text-[10px] text-[#5d7a9a] mt-1">{timeAgo(n.createdAt)}</p>
                  </div>

                  {/* Mark read */}
                  {!n.isRead && (
                    <button
                      onClick={() => handleMarkOne(n._id)}
                      className="shrink-0 text-[#5d7a9a] hover:text-[#00c896] transition mt-0.5"
                      title="Mark as read"
                    >
                      <IconCheck size={13} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

        </div>
      )}
    </div>
  );
}
