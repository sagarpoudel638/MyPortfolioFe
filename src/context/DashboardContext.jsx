// src/context/DashboardContext.jsx
import { createContext, useContext, useState, useCallback } from "react";
import { getDashboard } from "../api/dashboard";

const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data: res } = await getDashboard();
      setData(res);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <DashboardContext.Provider value={{ data, loading, error, lastUpdated, refresh }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);