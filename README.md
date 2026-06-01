# MyPortfolio — Frontend

React SPA for the MyPortfolio app. Displays portfolio holdings, live prices, FX rates, analytics, and a watchlist — all in a dashboard-style UI.

## Tech Stack

- **Framework:** React 18
- **Build tool:** Vite
- **Routing:** React Router v7
- **Styling:** Tailwind CSS v4
- **Charts:** Recharts, Chart.js / react-chartjs-2
- **Icons:** Tabler Icons
- **HTTP:** Axios

## Project Structure

```
src/
├── App.jsx                 # Route definitions
├── main.jsx                # React entry point
├── index.css               # Global styles
├── api/                    # Axios API modules
│   ├── client.js           # Axios instance + token refresh interceptor
│   ├── auth.js
│   ├── dashboard.js
│   ├── holdings.js
│   ├── watchlist.js
│   ├── prices.js
│   ├── snapshots.js
│   ├── fx.js
│   └── settings.js
├── context/
│   ├── AuthContext.jsx     # Auth state + token management
│   └── DashboardContext.jsx
├── components/
│   ├── layout/             # AppLayout, Sidebar, Topbar, FXStrip, MarketStatusBar
│   ├── dashboard/          # KpiGrid, KpiCard, HoldingsTable, AllocationChart, PlatformTable
│   ├── analytics/          # PnlTimeline, SectorBreakdown, CurrencyExposure, PlatformPnL
│   ├── watchlist/          # WatchlistCard, WatchlistItem, WatchlistTabs, etc.
│   ├── holdings/           # HoldingForm
│   └── ui/                 # Badge, Chip, Modal
└── pages/
    ├── auth/               # LoginPage, SignUpPage, VerifyEmailPage, ForgotPasswordPage, ResetPasswordPage
    ├── dashboard/          # Dashboard
    ├── analytics/          # Analytics
    ├── portfolio/          # PortfolioPage (per-platform view)
    ├── watchlist/          # WatchlistPage
    └── settings/           # SettingsPage
```

## Getting Started

### Prerequisites

- Node.js 18+
- Backend running (see `myportfoliobe/`)

### Installation

```bash
cd myportfoliofe
npm install
```

### Environment Variables

Create a `.env` file in the root of `myportfoliofe/`:

```env
VITE_API_URL=http://localhost:3000/api
```

### Running

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

App runs on `http://localhost:5173` by default.

## Pages & Routes

| Route | Auth | Description |
|-------|------|-------------|
| `/login` | Public | Login |
| `/register` | Public | Sign up |
| `/verify-email` | Public | Email verification callback |
| `/forgot-password` | Public | Request password reset |
| `/reset-password` | Public | Set new password via token |
| `/` | Protected | Dashboard — portfolio summary, KPIs, holdings |
| `/portfolio/:platform` | Protected | Per-platform holdings breakdown |
| `/watchlist` | Protected | Watchlists with live price data |
| `/analytics` | Protected | PnL timeline, sector & currency breakdown |
| `/settings` | Protected | Account settings, base currency |

## Auth Flow

Access tokens are stored in memory (React context). Refresh tokens are persisted in `localStorage`. The Axios client in `api/client.js` automatically retries failed requests after refreshing the access token.
