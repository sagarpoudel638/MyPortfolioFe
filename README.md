# MyPortfolio — Frontend

React SPA for the MyPortfolio app. Displays portfolio holdings, live prices, FX rates, analytics, and a watchlist — all in a dashboard-style UI.

## About

MyPortfolio is a personal investment portfolio tracker that consolidates holdings across multiple brokerage platforms — Australian (CommBank, CommSec Pocket), US (Webull), and Nepali (Meroshare/NEPSE) — into a single dashboard. It shows live prices, cross-currency P&L, allocation breakdowns, and historical performance charts.

## Features

- **Unified dashboard** — total portfolio value, invested amount, profit/loss, and return % across all platforms in one view
- **Per-platform breakdown** — drill into holdings by platform (CommBank, CommSec Pocket, Webull, Meroshare) with individual stock-level data
- **Live FX strip** — real-time AUD/USD and AUD/NPR rates displayed in the top bar
- **Market status indicator** — shows whether ASX, US, or NEPSE markets are currently open
- **Holdings table** — per-stock current price, day change %, 52-week high/low, invested vs. current value, and P&L
- **Allocation chart** — visual breakdown of portfolio allocation by platform
- **Analytics page** — P&L timeline chart, sector breakdown, currency exposure, and per-platform P&L comparison
- **Watchlist** — create named watchlists, add tickers, and monitor live prices without tracking them as holdings
- **Add/edit/delete holdings** — full CRUD for holdings with support for free allotments and manual price overrides
- **Settings** — update base currency and account preferences
- **Full auth flow** — login, register, email verification, forgot/reset password
- **Persistent sessions** — stays logged in across page reloads via refresh token

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
