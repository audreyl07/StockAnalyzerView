import axios from 'axios';

const API_KEY = process.env.REACT_APP_API_KEY; // Ensure you have your API key in the .env file
const BASE_URL = 'https://api.example.com/stocks'; // Replace with the actual API endpoint

export const fetchHistoricalData = async (symbol, startDate, endDate) => {
    try {
        const response = await axios.get(`${BASE_URL}/${symbol}/historical`, {
            params: {
                start: startDate,
                end: endDate,
                apiKey: API_KEY
            }
        });
        return response.data; 
    } catch (error) { 
        console.error('Error fetching historical data:', error);
        throw error;
    } 
}; 