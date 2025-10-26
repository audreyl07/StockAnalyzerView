import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock child components to avoid rendering charts and making network calls
jest.mock('../ChartComponent', () => ({
  ChartComponent: ({ symbol, type }) => (
    <div data-testid="chart-component">Chart for {symbol} ({type})</div>
  ),
}));

jest.mock('../IndexComponent', () => ({
  IndexComponent: ({ index }) => (
    <div data-testid="index-component">Index: {index}</div>
  ),
}));

import { App } from '../App';

describe('App', () => {
  test('renders Indices tab by default and shows IndexComponent', () => {
    render(<App />);

    // Indices tab should be selected by default; IndexComponent should be visible
    expect(screen.getByTestId('index-component')).toHaveTextContent('Index: SPX');

    // Stock Chart tab should also be present
    expect(screen.getByRole('tab', { name: /stock chart/i })).toBeInTheDocument();
  });

  test('switches to Stock Chart tab and updates symbol on Enter', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Switch to Stock Chart tab
    await user.click(screen.getByRole('tab', { name: /stock chart/i }));

    // Input should appear; type a new symbol and press Enter
    const input = await screen.findByPlaceholderText(/enter symbol and press enter/i);
    await user.clear(input);
    await user.type(input, 'AAPL{enter}');

    // Our mock ChartComponent should render with the new symbol
    expect(await screen.findByTestId('chart-component')).toHaveTextContent('AAPL');
  });
});
