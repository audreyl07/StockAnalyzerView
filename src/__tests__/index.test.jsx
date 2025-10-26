import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { act } from 'react';

// Mock lightweight App and ErrorBoundary to avoid heavy rendering
jest.mock('../App', () => ({
  App: () => <div data-testid="app">App</div>,
}));

jest.mock('../ErrorBoundary', () => ({
  ErrorBoundary: ({ children }) => <div data-testid="eb">{children}</div>,
}));

// Wrap React 18/19 concurrent root.render in act to silence warnings in tests
jest.mock('react-dom/client', () => {
  const actual = jest.requireActual('react-dom/client');
  const React = require('react');
  return {
    ...actual,
    createRoot: (container) => {
      const realRoot = actual.createRoot(container);
      const originalRender = realRoot.render.bind(realRoot);
      return {
        ...realRoot,
        render: (ui) => React.act(() => { originalRender(ui); }),
      };
    },
  };
});

describe('index.js entry', () => {
  beforeEach(() => {
    // Ensure a clean root for each test
    document.body.innerHTML = '<div id="root"></div>';
    // Clear module cache so index.js executes fresh per test
    jest.resetModules();
  });

  test('creates a React root and renders ErrorBoundary + App into #root', async () => {
    // Import the entry (this triggers createRoot and render); wrap/flush with act
    await act(async () => {
      require('../index.js');
    });
    // Flush any pending microtasks from concurrent rendering
    await act(async () => {});

    // Verify rendered output is present under #root
    const root = document.getElementById('root');
    expect(root).not.toBeNull();

    // Presence of our mocked components (wait in case of async commit)
    await waitFor(() => expect(screen.getByTestId('eb')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByTestId('app')).toBeInTheDocument());
  });
});
