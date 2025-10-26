/**
 * chartApi.js - Backend API Communication Module
 * 
 * Provides functions to fetch chart data from the backend API server.
 * 
 * API Endpoint Structure:
 * http://localhost:8080/{dataType}/{resultType}/{symbol}
 * 
 * Parameters:
 * - dataType: 'stock' | 'index' | 'market'
 * - resultType: 'full' (OHLCV) | 'single' (close only)
 * - symbol: Stock ticker or index symbol
 * 
 * Expected Response Format:
 * Array of objects with:
 * - Candlestick: { time, open, high, low, close, volume? }
 * - Line: { time, value }
 * 
 * Note: Backend must be running at http://localhost:8080
 */

/**
 * Fetches chart data from the backend API
 * 
 * @param {string} dataType - Type of data to fetch: 'stock', 'index', or 'market'
 * @param {string} resultType - Result format: 'full' (OHLCV) or 'single' (close only)
 * @param {string} symbol - The ticker symbol or index identifier
 * @returns {Promise<Array>} Array of chart data points
 * @throws {Error} If network request fails or response is not ok
 * 
 * @example
 * // Fetch full candlestick data for Tesla stock
 * const data = await fetchChartData('stock', 'full', 'TSLA');
 * 
 * @example
 * // Fetch S&P 500 index data
 * const data = await fetchChartData('index', 'full', 'SPX');
 * 
 * @example
 * // Fetch market breadth indicator
 * const data = await fetchChartData('market', 'single', 'MA_50_200');
 */
export const fetchChartData = async (dataType = 'stock', resultType = 'full', symbol = 'TSLA') => {
    try {
        // Log the request URL for debugging
        console.log(`Fetching data from http://localhost:8080/${dataType}/${resultType}/${symbol}`);
        
        // Make the HTTP request
        const response = await fetch(`http://localhost:8080/${dataType}/${resultType}/${symbol}`);
        
        // Check if response is successful (status 200-299)
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        // Parse JSON response
        const data = await response.json();
        console.log('Fetched chart data:', data);
        return data;
    } catch (error) {
        // Log error and re-throw for caller to handle
        console.error('Error fetching chart data:', error);
        throw error;
    }
};