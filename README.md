# StockAnalyzerView

Interactive stock and index charts built with React, Parcel, and TradingView's lightweight-charts. It shows candlesticks with 20/50/200-day moving averages, volume histogram with a 20-day average, and an additional market breadth series for indices. A simple input lets you switch the stock symbol on the fly.

## Features

- Indices tab (S&P 500, Nasdaq 100, Dow Jones) with:
	- Candlestick chart
	- 20/50/200-day moving average overlays
	- Volume histogram + 20-day volume MA (separate pane)
	- Market series: MA(50)/MA(200) breadth ratio in a separate pane (percent scale)
- Stock Chart tab with:
	- Candlestick chart for a chosen symbol (default: TSLA)
	- 20/50/200-day moving averages
	- Volume histogram + 20-day volume MA
- ErrorBoundary wrapper with a friendly fallback and retry button
- Parcel-powered fast dev server and production build

## Tech stack

- React 19 + ReactDOM 19
- Material UI 7 (@mui/material)
- lightweight-charts 5
- Parcel Bundler 1
- TypeScript (for utility modules)

## Quick start

Prerequisites:

- Node.js (LTS recommended)

Install dependencies and start the dev server:

```powershell
npm install
npm start
```

Parcel will serve the app and open it in your browser. By default, the UI expects a backend API on http://localhost:8080.

## Scripts

- `npm start` – Run dev server (Parcel) for `src/index.html`
- `npm run build` – Production build to `dist/`
- `npm run watch` – Parcel watch mode (no dev server)

See `package.json` for the full list.

## Backend API contract

The frontend fetches chart data from a local service. Endpoints are constructed as:

```
http://localhost:8080/{dataType}/{resultType}/{symbol}
```

Used combinations:

- Stocks: `stock/single/:symbol` or `stock/full/:symbol`
	- The Stock Chart currently requests `full` when using candlesticks (default).
- Indices: `index/full/:indexSymbol` where `:indexSymbol` is one of `SPX`, `NDX`, `DJI`.
- Market breadth: `market/single/MA_50_200` (displayed as a percent series beneath the index chart)

Expected data shapes (lightweight-charts compatible):

- Candlestick bar (preferred for prices):
	- `{ time, open, high, low, close, volume? }`
- Line point (indicators/breadth):
	- `{ time, value }`

Notes:

- `time` should be a Unix timestamp in seconds (UTC) compatible with lightweight-charts `UTCTimestamp`.
- Volume is optional; if provided, it enables the volume histogram.
- The MA(50)/MA(200) breadth series is expected as a decimal ratio (e.g., 0.75 for 75%) and is rendered on a percent scale.

## App overview

- `App.js` – Top-level layout with two tabs (Indices, Stock Chart). Symbol input appears on the Stock Chart tab; press Enter to apply.
- `ChartComponent.jsx` – Renders the stock chart (candlestick by default) with MA overlays and volume pane.
- `IndexComponent.jsx` – Renders the selected index (candlestick), MA overlays, volume pane, and MA(50)/MA(200) breadth pane.
- `ErrorBoundary.jsx` – Catches render errors and provides a retry UI.
- `api/chartApi.js` – Tiny wrapper around `fetch` for the API above.

Utilities (TypeScript, all lightweight-charts friendly):

- `utils/moving-average-calculation.ts` – Configurable SMA/EMA/WMA generator with optional offset and smoothing.
- `utils/weighted-close-calculation.ts` – Weighted close calculator with optional offset.
- `utils/correlation-calculation.ts` – Rolling Pearson correlation between two series (by closest-time alignment).
- `utils/closest-index.ts` – Binary search helper to find closest time index with simple caching.
- `utils/timestamp-data.ts` – Runtime guard ensuring `time` is a numeric UTC timestamp.

## Project structure

```
src/
	App.js
	ChartComponent.jsx
	IndexComponent.jsx
	ErrorBoundary.jsx
	index.html
	index.js
	api/
		chartApi.js
	utils/
		closest-index.ts
		correlation-calculation.ts
		moving-average-calculation.ts
		timestamp-data.ts
		weighted-close-calculation.ts
```

## Customization tips

- Default symbol is `TSLA`; change via the input on the Stock Chart tab (press Enter) or pass `symbol` to `ChartComponent`.
- To switch chart type for stocks, pass `type="line" | "candlestick"` to `ChartComponent`.
- Colors can be customized by passing a `colors` object to components.
- API base URL is currently hardcoded to `http://localhost:8080`; consider promoting this to an environment variable for flexibility.

## Troubleshooting

- Blank chart or errors: ensure the backend is running and returning valid JSON in the expected shapes.
- Incorrect timestamps: lightweight-charts expects seconds since epoch (UTC). If you send milliseconds, divide by 1000.
- Volume missing: if `volume` isn’t present on bars, the volume histogram will be empty.
- Parcel build issues: delete `.cache` and `dist`, then rerun `npm start`.

## License

MIT – see `LICENSE` for details.

---

Made with React, MUI, and lightweight-charts.
