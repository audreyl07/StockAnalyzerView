import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorBoundary } from '../ErrorBoundary';

function Healthy() {
  return <div data-testid="healthy">All good</div>;
}

function Boom() {
  throw new Error('boom');
}

describe('ErrorBoundary', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  test('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <Healthy />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('healthy')).toHaveTextContent('All good');
  });

  test('shows fallback UI when a child throws', () => {
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>
    );

  // Fallback heading
  expect(screen.getByText(/Chart Error/i)).toBeInTheDocument();
  // Error message from thrown error (there may be multiple matches including stack details)
  const boomMatches = screen.getAllByText(/boom/i);
  expect(boomMatches.length).toBeGreaterThanOrEqual(1);
    // Button exists
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();

    // Console error should be called by componentDidCatch
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  test('Try Again resets error state and renders new healthy child after rerender', async () => {
    const user = userEvent.setup();

    const { rerender } = render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>
    );

    // Confirm fallback is shown
    expect(screen.getByText(/Chart Error/i)).toBeInTheDocument();

    // Swap the child to a healthy component
    rerender(
      <ErrorBoundary>
        <Healthy />
      </ErrorBoundary>
    );

    // Click Try Again to clear hasError flag
    await user.click(screen.getByRole('button', { name: /try again/i }));

    // Now the healthy child should render
    expect(screen.getByTestId('healthy')).toHaveTextContent('All good');
  });
});
