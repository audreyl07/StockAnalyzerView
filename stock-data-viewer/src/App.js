import React, { useState } from 'react';
import Header from './components/Header/Header';
import StockSearch from './components/StockSearch/StockSearch';
import Chart from './components/Chart/Chart';
import './App.css';

function App() {
  const [currentSymbol, setCurrentSymbol] = useState('AAPL');
  const apiBaseUrl = process.env.REACT_APP_API_URL || 'https://your-api-url.com/api';

  const handleSymbolChange = (symbol) => {
    setCurrentSymbol(symbol);
  };

  return (
    <div className="App">
      <Header />
      <div className="container">
        <StockSearch onSymbolChange={handleSymbolChange} />
        <div className="chart-wrapper">
          <Chart symbol={currentSymbol} apiBaseUrl={apiBaseUrl} />
        </div>
      </div>
    </div>
  );
}

export default App;