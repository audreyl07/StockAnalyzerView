import React, { useEffect, useRef } from 'react';
import CustomDatafeed from './CustomDatafeed';

const Chart = ({ symbol, apiBaseUrl }) => {
  const chartContainerRef = useRef(null);
  let widget = null;

  useEffect(() => {
    // Clean up previous widget if exists
    if (widget) {
      widget.remove();
    }

    // Initialize the TradingView widget
    widget = new window.TradingView.widget({
      symbol: symbol || 'AAPL',
      interval: 'D',
      container_id: 'tv-chart-container',
      datafeed: new CustomDatafeed(apiBaseUrl),
      library_path: '/charting_library/',
      locale: 'en',
      disabled_features: ['use_localstorage_for_settings'],
      enabled_features: ['study_templates'],
      charts_storage_url: 'https://saveload.tradingview.com',
      charts_storage_api_version: '1.1',
      client_id: 'tradingview.com',
      user_id: 'public_user',
      fullscreen: false,
      autosize: true,
      theme: 'Light',
    });

    return () => {
      if (widget) {
        widget.remove();
      }
    };
  }, [symbol, apiBaseUrl]);

  return (
    <div
      id="tv-chart-container"
      ref={chartContainerRef}
      style={{
        height: '600px',
        width: '100%',
      }}
    />
  );
};

export default Chart;