/**
 * ErrorBoundary.jsx - React Error Boundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree and displays
 * a fallback UI instead of crashing the entire application.
 * 
 * Features:
 * - Catches rendering errors, lifecycle errors, and errors in constructors
 * - Displays user-friendly error message
 * - Shows detailed error stack trace (expandable)
 * - Provides "Try Again" button to reset error state
 * - Logs errors to console for debugging
 * 
 * Usage:
 * Wrap any component that might throw errors:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * 
 * Note: Error boundaries do NOT catch errors in:
 * - Event handlers (use try-catch instead)
 * - Asynchronous code (setTimeout, promises)
 * - Server-side rendering
 * - Errors thrown in the error boundary itself
 */

import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }
  //updates state to trigger fallback UI rendering
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  //logs and stores error details 
  componentDidCatch(error, errorInfo) {
    // Log detailed error information to console for debugging
    console.error('Chart Error:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });

    // Store error details in state for display
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  //Renders either the fallback UI (if error) or children (if no error)
  render() {
    // If an error has been caught, show the fallback UI
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center',
          border: '1px solid #ff0000',
          borderRadius: '4px',
          margin: '10px'
        }}>
          <h2 style={{ color: '#ff0000' }}>Chart Error</h2>
          <p>{this.state.error && this.state.error.message}</p>
          
          {/* Expandable section with detailed error stack */}
          <details style={{ whiteSpace: 'pre-wrap', marginBottom: '10px' }}>
            <summary>Error Details</summary>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
          
          {/* Button to reset error state and try rendering again */}
          <button 
            onClick={() => this.setState({ hasError: false })}
            style={{
              padding: '8px 16px',
              backgroundColor: '#0066cc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    // No error: render children normally
    return this.props.children;
  }
}