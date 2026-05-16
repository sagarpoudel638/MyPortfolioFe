import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from './pages/dashboard/Dashboard'
import Analytics from "./pages/analytics/Analytics";
import PortfolioPage from "./pages/portfolio/PortfolioPage";
import WatchlistPage from "./pages/watchlist/WatchlistPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route
  path="/portfolio/:platform"
  element={<PortfolioPage />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App
