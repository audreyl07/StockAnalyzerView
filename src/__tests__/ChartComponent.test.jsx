import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock lightweight-charts with observable behavior
jest.mock('lightweight-charts', () => {
  let mockLastChart;
  const mockCreateChart = jest.fn(() => {
    const chart = {
      addSeries: jest.fn((typeArg) => {
        chart._seriesTypes.push(typeArg);
        return { setData: jest.fn() };
      }),
      addPane: jest.fn(() => ({
        setHeight: jest.fn(),
        addSeries: jest.fn((typeArg) => {
          chart._paneSeriesTypes.push(typeArg);
          return { setData: jest.fn() };
        }),
      })),
      applyOptions: jest.fn(),
      timeScale: jest.fn(() => ({ fitContent: jest.fn() })),
      remove: jest.fn(),
      _seriesTypes: [],
      _paneSeriesTypes: [],
    };
    mockLastChart = chart;
    return chart;
  });

  // Use symbols so we can compare strict equality for types passed to addSeries
  const LineSeries = Symbol('LineSeries');
  const CandlestickSeries = Symbol('CandlestickSeries');
  const HistogramSeries = Symbol('HistogramSeries');
  return {
    createChart: (...args) => mockCreateChart(...args),
    ColorType: { Solid: 'Solid' },
    LineSeries,
    CandlestickSeries,
    HistogramSeries,
    // helper for tests to inspect the most recent chart stub
    __getLastChart: () => mockLastChart,
  };
}, { virtual: true });

// Mock API layer
const sampleCandleData = [
  { time: 1698192000, open: 100, high: 105, low: 98, close: 102, volume: 1000 },
  { time: 1698278400, open: 102, high: 106, low: 101, close: 104, volume: 1200 },
  { time: 1698364800, open: 104, high: 107, low: 103, close: 103, volume: 900 },
  { time: 1698451200, open: 103, high: 108, low: 102, close: 107, volume: 1800 },
  { time: 1698537600, open: 107, high: 109, low: 106, close: 108, volume: 1600 },
];

const mockFetchChartData = jest.fn();
jest.mock('../api/chartApi', () => ({
  fetchChartData: (...args) => mockFetchChartData(...args),
}));

// Mock TS utility to avoid TS transform in Jest
jest.mock('../utils/moving-average-calculation', () => ({
  calculateMovingAverageIndicatorValues: jest.fn(() => []),
}), { virtual: true });

import { __getLastChart, LineSeries, CandlestickSeries, HistogramSeries } from 'lightweight-charts';
import { ChartComponent } from '../ChartComponent';

function defer() {
  let resolve, reject;
  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}

describe('ChartComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows loading then renders chart for candlestick type', async () => {
    mockFetchChartData.mockResolvedValueOnce(sampleCandleData);

    render(<ChartComponent symbol="TSLA" type="candlestick" />);

    // Initially shows loading state
    expect(screen.getByText(/Loading chart data/i)).toBeInTheDocument();

    // Wait for chart to be initialized (loading disappears)
    await waitFor(() => expect(screen.queryByText(/Loading chart data/i)).not.toBeInTheDocument());

    // Verify chart creation
    const chart = __getLastChart();
    expect(chart).toBeTruthy();

    // First addSeries call should be for the main series and use CandlestickSeries for candlestick type
    expect(chart.addSeries).toHaveBeenCalled();
    const firstSeriesType = chart._seriesTypes[0];
    expect(firstSeriesType).toBe(CandlestickSeries);

    // Ensure a volume pane Series was added with HistogramSeries
    expect(chart.addPane).toHaveBeenCalled();
    // The addPane stub collects pane series types in chart._paneSeriesTypes
    expect(chart._paneSeriesTypes).toContain(HistogramSeries);

    // Moving averages should add 3 LineSeries overlays on the main chart
    const mainLineSeriesCount = chart._seriesTypes.filter(t => t === LineSeries).length;
    expect(mainLineSeriesCount).toBeGreaterThanOrEqual(3);
  });

  test('uses LineSeries for main series when type="line"', async () => {
    mockFetchChartData.mockResolvedValueOnce(sampleCandleData.map(d => ({ time: d.time, value: d.close })));

    render(<ChartComponent symbol="TSLA" type="line" />);

    await waitFor(() => expect(screen.queryByText(/Loading chart data/i)).not.toBeInTheDocument());

    const chart = __getLastChart();
    const firstSeriesType = chart._seriesTypes[0];
    expect(firstSeriesType).toBe(LineSeries);
  });

  test('renders error state when data fetch fails', async () => {
    mockFetchChartData.mockRejectedValueOnce(new Error('boom'));

    render(<ChartComponent symbol="TSLA" type="candlestick" />);

    expect(await screen.findByText(/Error loading chart data: boom/i)).toBeInTheDocument();
  });
});
