# StockAnalyzerView

An interactive stock and index chart built with React, Parcel and TradingView's lightweight-charts. It features candlestick charts with 50/200 day moving averages, volume histograms with 20-day averages and market indicators for major indices. Switch stock symbols with a simple input to look at different markets. 

**Tech Stack:** React 19, Material UI 7, lightweight-charts 5, Parcel Bundler 1, TypeScript
## Features

## Installation- Indices tab (S&P 500, Nasdaq 100, Dow Jones) with:

	- Candlestick chart

**Prerequisites:**	- 50/200-day moving average overlays

- Node.js (LTS version recommended)	- Volume histogram + 20-day volume MA (separate pane)

	- Market series: MA(50)/MA(200) breadth ratio in a separate pane (percent scale)

**Steps:**- Stock Chart tab with:

	- Candlestick chart for a chosen symbol (default: TSLA)

1. Clone or download this repository

2. Navigate to the project directory

3. Install dependencies:- ErrorBoundary wrapper with a friendly fallback and retry button

- Parcel-powered fast dev server and production build

```powershell

npm install

```

- React 19 + ReactDOM 19

4. Start the development server:- Material UI 7 (@mui/material)

- lightweight-charts 5

```powershell- Parcel Bundler 1

npm start- TypeScript (for utility modules)

```

## Quick start

Parcel will automatically open the application in your browser at `http://localhost:1234` (or another available port).

Prerequisites:

**Note:** The application expects a backend API running at `http://localhost:8080`. Ensure your backend is running before starting the frontend.


## Usage

Install dependencies and start the dev server:

### Viewing Market Indices

1. Open the application (default tab is **Indices**)npm install

2. Select an index using the toggle buttons:npm start

   - **S&P 500** (SPX)```

   - **Nasdaq 100** (NDX)

   - **Dow Jones** (DJI)

3. View the candlestick chart with:

   - 50/200-day moving averages (orange/green/pink lines)

   - Volume histogram with 20-day moving average (lower pane)

   - MA(50)/MA(200) breadth ratio (bottom pane, percent scale)- `npm start` – Run dev server (Parcel) for `src/index.html`

- `npm run build` – Production build to `dist/`


### Available Chart Features

- **Zoom:** Scroll mouse wheel or pinch on touchpad

- **Pan:** Click and drag on the chart```

- **Reset view:** Double-click the chart

- **Crosshair:** Hover over the chart to see precise valuesUsed combinations:


## Configuration

### API Endpoint Configuration	- `{ time, open, high, low, close, volume? }`

- Line point (indicators/breadth):

The application fetches data from `http://localhost:8080`. To change this:	- `{ time, value }`

1. Open `src/api/chartApi.js`Notes:

2. Modify the base URL in the `fetchChartData` function:

- `time` should be a Unix timestamp in seconds (UTC) compatible with lightweight-charts `UTCTimestamp`.

```javascript- Volume is optional; if provided, it enables the volume histogram.

const response = await fetch(`http://your-api-url:port/${dataType}/${resultType}/${symbol}`);- The MA(50)/MA(200) breadth series is expected as a decimal ratio (e.g., 0.75 for 75%) and is rendered on a percent scale.

```

## Project structure
```
StockAnalyzerView/
├── .cache/                     # Parcel build cache (generated)
├── .git/                       # Git repository metadata
├── dist/                       # Production build output (generated)
├── node_modules/               # NPM dependencies (generated)
├── src/                        # Source code directory
│   ├── api/
│   │   └── chartApi.js         # API fetch wrapper for backend communication
│   ├── utils/
│   │   ├── closest-index.ts           # Binary search helper for time-based lookups
│   │   ├── correlation-calculation.ts # Rolling Pearson correlation calculator
│   │   ├── moving-average-calculation.ts  # SMA/EMA/WMA indicator calculations
│   │   ├── timestamp-data.ts          # Timestamp validation utility
│   │   └── weighted-close-calculation.ts  # Weighted close price calculator
│   ├── App.js                  # Main application component with tab navigation
│   ├── ChartComponent.jsx      # Stock chart component (candlestick/line)
│   ├── ErrorBoundary.jsx       # Error boundary wrapper with retry functionality
│   ├── index.html              # HTML entry point
│   ├── index.js                # React application initialization
│   └── IndexComponent.jsx      # Index chart component with breadth indicator
├── .gitignore                  # Git ignore rules
├── LICENSE                     # MIT license file
├── package.json                # NPM dependencies and scripts
└── README.md                   # Project documentation (this file)
```

### Customizing Chart Appearance

**Change default stock symbol:**

Edit `src/App.js`:
```javascript
const [symbol, setSymbol] = useState('AAPL'); 
```

**Change chart type (line vs candlestick):**

In `src/App.js`, modify the `ChartComponent`:
```jsx
<ChartComponent type="line" symbol={symbol} />
```

**Customize colors:**

Pass a `colors` object to components:
```jsx
<ChartComponent 
  symbol={symbol}
  colors={{
    backgroundColor: '#1e1e1e',
    lineColor: '#2962FF',
    textColor: '#d1d4dc'
  }}
/>
```

### Moving Average Configuration

Edit `src/ChartComponent.jsx` or `src/IndexComponent.jsx`:

```javascript
const movingAverages = [
  { length: 20, color: 'orange' },
  { length: 50, color: 'green' },
  { length: 200, color: 'pink' }
];
```

Modify `length` and `color` values as needed.

## Testing
1. **Start the backend API** serving data at `http://localhost:8080`
2. **Run the development server:**
   ```powershell
   npm start
   ```
3. **Manually test features:**
   - Switch between Indices and Stock Chart tabs
   - Change index selections (SPX, NDX, DJI)
   - Enter different stock symbols and verify charts load
   - Test zoom, pan, and crosshair interactions
   - Verify moving averages and volume histograms render correctly
   - Test error handling by stopping the backend

### Troubleshooting

**Blank chart or loading errors:**
- Ensure backend is running at `http://localhost:8080`
- Check browser console for network errors
- Verify API returns data in the correct format

**Incorrect timestamps:**
- lightweight-charts expects **seconds** since epoch (UTC)
- If using milliseconds, divide by 1000

**Volume not displaying:**
- Ensure `volume` field is present in candlestick data

**Parcel build issues:**
- Delete `.cache` and `dist` folders
- Reinstall dependencies: `npm install`
- Restart dev server: `npm start`

## Contact & Additional Information

**License:** MIT License (see `LICENSE` file)

**Technologies:**
- [React](https://react.dev/) - UI framework
- [Material-UI](https://mui.com/) - Component library
- [lightweight-charts](https://tradingview.github.io/lightweight-charts/) - TradingView charting library
- [Parcel](https://parceljs.org/) - Zero-config bundler

**Contributing:**

1. Fork this repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

**Known Limitations:**
- API base URL is hardcoded (consider environment variables for production)
- No automated tests
- Backend must be running locally

---

Built with React, Material-UI, and lightweight-charts by TradingView.
