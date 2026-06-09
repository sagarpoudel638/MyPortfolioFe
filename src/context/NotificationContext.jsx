// context/NotificationContext.jsx
// Provides a global unread count that the sidebar badge reads.
// The full notifications page fetches its own data on mount.

import { createContext, useContext, useEffect, useState } from "react";
import { getNotifications } from "../api/notifications";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext({ unreadCount: 0, refresh: () => {} });

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const refresh = async () => {
    if (!user) return;
    try {
      const { data } = await getNotifications();
      setUnreadCount(data.unreadCount);
    } catch {
      // Silently ignore — badge just won't update
    }
  };

  // Fetch on login and every 60 seconds
  useEffect(() => {
    if (!user) { setUnreadCount(0); return; }
    refresh();
    const id = setInterval(refresh, 60000);
    return () => clearInterval(id);
  }, [user]);

  return (
    <NotificationContext.Provider value={{ unreadCount, setUnreadCount, refresh }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
