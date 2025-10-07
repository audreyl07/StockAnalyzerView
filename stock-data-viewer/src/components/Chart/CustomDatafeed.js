class CustomDatafeed {
  constructor(apiBaseUrl) {
    this.apiBaseUrl = apiBaseUrl;
  }

  // Required methods
  onReady(callback) {
    // Called once when chart is initialized
    setTimeout(() => callback({
      supported_resolutions: ["1", "5", "15", "30", "60", "D", "W", "M"]
    }), 0);
  }

  searchSymbols(userInput, exchange, symbolType, onResultReadyCallback) {
    // Search for symbols matching user input
    fetch(`${this.apiBaseUrl}/search?query=${userInput}`)
      .then(response => response.json())
      .then(data => onResultReadyCallback(data));
  }

  resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
    // Resolve symbol info
    fetch(`${this.apiBaseUrl}/symbol_info?symbol=${symbolName}`)
      .then(response => response.json())
      .then(symbolInfo => {
        const defaultSymbolInfo = {
          name: symbolName,
          description: symbolName,
          type: 'stock',
          session: '24x7',
          timezone: 'America/New_York',
          ticker: symbolName,
          minmov: 1,
          pricescale: 100,
          has_intraday: true,
          supported_resolutions: ["1", "5", "15", "30", "60", "D", "W", "M"],
          volume_precision: 0,
          data_status: 'streaming',
        };
        onSymbolResolvedCallback(symbolInfo || defaultSymbolInfo);
      })
      .catch(error => {
        console.error(`Error resolving symbol: ${error}`);
        onResolveErrorCallback('Symbol not found');
      });
  }

  getBars(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
    // Fetch historical bars
    const url = `${this.apiBaseUrl}/history?symbol=${symbolInfo.ticker}&resolution=${resolution}&from=${from}&to=${to}`;
    
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.s === 'ok' && data.t.length > 0) {
          const bars = data.t.map((time, index) => ({
            time: time * 1000, // Convert to milliseconds
            open: data.o[index],
            high: data.h[index],
            low: data.l[index],
            close: data.c[index],
            volume: data.v[index]
          }));
          
          onHistoryCallback(bars, { noData: false });
        } else {
          onHistoryCallback([], { noData: true });
        }
      })
      .catch(error => {
        console.error(`Error getting bars: ${error}`);
        onErrorCallback(error);
      });
  }

  subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) {
    // For real-time updates - not needed for historical data only
    console.log('subscribeBars called');
  }

  unsubscribeBars(subscriberUID) {
    // For real-time updates - not needed for historical data only
    console.log('unsubscribeBars called');
  }
}

export default CustomDatafeed;