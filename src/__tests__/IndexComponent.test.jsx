import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

// Mock lightweight-charts with observable behavior for panes and series types
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

  const LineSeries = Symbol('LineSeries');
  const CandlestickSeries = Symbol('CandlestickSeries');
  const HistogramSeries = Symbol('HistogramSeries');
  return {
    createChart: (...args) => mockCreateChart(...args),
    ColorType: { Solid: 'Solid' },
    LineSeries,
    CandlestickSeries,
    HistogramSeries,
    __getLastChart: () => mockLastChart,
  };
}, { virtual: true });

// Mock TS utility to avoid TS transform in Jest
jest.mock('../utils/moving-average-calculation', () => ({
  calculateMovingAverageIndicatorValues: jest.fn(() => []),
}), { virtual: true });

// Mock API layer with argument-aware responses
const mockFetchChartData = jest.fn();
jest.mock('../api/chartApi', () => ({
  fetchChartData: (...args) => mockFetchChartData(...args),
}));

import { __getLastChart, LineSeries, CandlestickSeries, HistogramSeries } from 'lightweight-charts';
import { IndexComponent } from '../IndexComponent';

describe('IndexComponent', () => {
  const sampleIndexData = [
    { time: 1698192000, open: 4300, high: 4350, low: 4290, close: 4320, volume: 100000000 },
    { time: 1698278400, open: 4320, high: 4360, low: 4310, close: 4350, volume: 110000000 },
    { time: 1698364800, open: 4350, high: 4375, low: 4330, close: 4340, volume: 105000000 },
  ];
  const sampleBreadthData = [
    { time: 1698192000, value: 0.62 },
    { time: 1698278400, value: 0.65 },
    { time: 1698364800, value: 0.59 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  function setupHappyFetches() {
    mockFetchChartData.mockImplementation((dataType, resultType, symbol) => {
      if (dataType === 'index' && resultType === 'full') return Promise.resolve(sampleIndexData);
      if (dataType === 'market' && resultType === 'single' && symbol === 'MA_50_200') return Promise.resolve(sampleBreadthData);
      return Promise.resolve([]);
    });
  }

  test('renders candlestick chart with volume pane and breadth pane', async () => {
    setupHappyFetches();

    render(<IndexComponent index="SPX" />);

    // Loading first
    expect(screen.getByText(/Loading chart data/i)).toBeInTheDocument();

    // Wait for loading to finish
    await waitFor(() => expect(screen.queryByText(/Loading chart data/i)).not.toBeInTheDocument());

    const chart = __getLastChart();
    expect(chart).toBeTruthy();

    // Main series is candlestick
    expect(chart._seriesTypes[0]).toBe(CandlestickSeries);

    // Volume pane adds a HistogramSeries
    expect(chart._paneSeriesTypes).toContain(HistogramSeries);

    // Breadth ratio pane adds a LineSeries
    expect(chart._paneSeriesTypes).toContain(LineSeries);
  });

  test('shows error state when fetch fails', async () => {
    mockFetchChartData.mockRejectedValueOnce(new Error('index failed'));

    render(<IndexComponent index="SPX" />);

    expect(await screen.findByText(/Error loading chart data: index failed/i)).toBeInTheDocument();
  });

  test('refetches when index prop changes', async () => {
    setupHappyFetches();
    const { rerender } = render(<IndexComponent index="SPX" />);

    await waitFor(() => expect(screen.queryByText(/Loading chart data/i)).not.toBeInTheDocument());

    // Change index to NDX triggers new fetch
    rerender(<IndexComponent index="NDX" />);

    await waitFor(() => expect(mockFetchChartData).toHaveBeenCalledWith('index', 'full', 'NDX'));
  });

  test('handles small dataset with fewer than 20 data points for volume MA', async () => {
    // Small dataset to trigger the early continue in calculateVolumeMovingAverage
    const smallDataset = [
      { time: 1698192000, open: 4300, high: 4350, low: 4290, close: 4320, volume: 100000000 },
      { time: 1698278400, open: 4320, high: 4360, low: 4310, close: 4350, volume: 110000000 },
    ];
    mockFetchChartData.mockImplementation((dataType, resultType, symbol) => {
      if (dataType === 'index' && resultType === 'full') return Promise.resolve(smallDataset);
      if (dataType === 'market' && resultType === 'single' && symbol === 'MA_50_200') return Promise.resolve(sampleBreadthData);
      return Promise.resolve([]);
    });

    render(<IndexComponent index="SPX" />);

    await waitFor(() => expect(screen.queryByText(/Loading chart data/i)).not.toBeInTheDocument());

    const chart = __getLastChart();
    expect(chart).toBeTruthy();
    // Chart should still render even with small dataset
    expect(chart.addSeries).toHaveBeenCalled();
  });

  test('handles error during chart rendering gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    setupHappyFetches();

    // Make chart.addSeries throw to trigger the catch block
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const mockCreateChartWithError = jest.fn(() => {
      const chart = {
        addSeries: jest.fn(() => {
          throw new Error('Chart rendering failed');
        }),
        addPane: jest.fn(() => ({
          setHeight: jest.fn(),
          addSeries: jest.fn(() => ({ setData: jest.fn() })),
        })),
        applyOptions: jest.fn(),
        timeScale: jest.fn(() => ({ fitContent: jest.fn() })),
        remove: jest.fn(),
        _seriesTypes: [],
        _paneSeriesTypes: [],
      };
      return chart;
    });

    // Temporarily override the mock
    const { createChart } = require('lightweight-charts');
    createChart.mockImplementationOnce(mockCreateChartWithError);

    render(<IndexComponent index="SPX" />);

    await waitFor(() => expect(screen.queryByText(/Loading chart data/i)).not.toBeInTheDocument());

    // Verify console.error was called with the chart error
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error setting chart data:', expect.any(Error));

    consoleErrorSpy.mockRestore();
  });
});
