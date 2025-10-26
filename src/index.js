/**
 * index.js - Application Entry Point
 * 
 * This file initializes the React application and mounts it to the DOM.
 * 
 * Key Responsibilities:
 * - Creates React root using React 18+ createRoot API
 * - Wraps the App component with ErrorBoundary for error handling
 * - Mounts the application to the #root div in index.html
 * 
 * Flow:
 * 1. Find the DOM element with id="root"
 * 2. Create a React root
 * 3. Render the App component wrapped in ErrorBoundary
 * 4. React takes over and manages the UI from here
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from './ErrorBoundary';
import { App } from './App';

// Get the root DOM element
const root = createRoot(document.getElementById('root'));

// Render the application
// ErrorBoundary catches any errors in the App or its children
root.render(
  <ErrorBoundary>
      <App/>
  </ErrorBoundary>
);
