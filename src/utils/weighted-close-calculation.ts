/**
 * weighted-close-calculation.ts - Weighted Close Price Indicator
 * 
 * Calculates the weighted close price, giving more emphasis to the closing price
 * while still considering the high and low of the period.
 * 
 * Formula: (Close × Weight + High + Low) / (Weight + 2)
 * Default Weight: 2
 * 
 * Rationale:
 * - Close price is most significant (where the period ended)
 * - High and low provide context about the range
 * - Weighted close smooths out noise while preserving trends
 * 
 * Features:
 * - Configurable weight for close price
 * - Optional time offset (shift forward/backward)
 * - Handles missing data gracefully
 * - Compatible with lightweight-charts
 * 
 * Use Cases:
 * - Alternative to simple close price
 * - Input for other indicators (MA, momentum)
 * - More stable than close alone
 * - Reduces impact of end-of-day manipulation
 */

import {
	CandlestickData,
	LineData,
	UTCTimestamp,
	WhitespaceData,
} from 'lightweight-charts';

const DEFAULT_WEIGHT = 2;

export type SupportedData = CandlestickData<UTCTimestamp> | WhitespaceData<UTCTimestamp>;

/**
 * Options for weighted close calculation.
 */
export interface WeightedCloseCalculationOptions {
	/**
	 * Offset to shift the result forward (positive) or backward (negative).
	 * E.g. offset=2 will display the weighted close bars ahead.
	 */
	offset?: number;
	/**
	 * Weight to apply to the close price. By default a weight of `2` is used.
	 */
	weight?: number;
}

/**
 * Calculates a weighted close (with optional offset and weight).
 *
 * For each item computes the weighted close value.
 *
 * @param {(CandlestickData | WhitespaceData)[]} data - The input data array (sorted by time).
 * @param {WeightedCloseCalculationOptions} options - Calculation options.
 * @returns {(LineData | WhitespaceData)[]} An array of values (or whitespace data).
 *
 * @example
 * const result = calculateWeightedCloseIndicatorValues(
 *   [{ time: 1, open: 10, high: 11, low: 9.9, close: 10.2 }, { time: 2, open: 10.2, high: 10.5, low: 9.9, close: 10.3 }],
 *   { length: 2 }
 * );
 */
export function calculateWeightedCloseIndicatorValues(
	data: (CandlestickData<UTCTimestamp> | WhitespaceData<UTCTimestamp>)[],
	options: WeightedCloseCalculationOptions
): (LineData<UTCTimestamp> | WhitespaceData<UTCTimestamp>)[] {
	if (data.length === 0) {
		return [];
	}

	const offset = options.offset ?? 0;
	const weight = options.weight ?? DEFAULT_WEIGHT;
	const result = new Array(data.length);
	const startIndex = offset > 0 ? offset : 0;
	const endIndex = offset < 0 ? (data.length - 1) + offset : data.length - 1;
	let resultIndex = 0;

	for (let i = 0; i < startIndex; i++) {
		result[resultIndex] = { time: data[i].time };
		resultIndex += 1;
	}

	for (let i = startIndex; i < endIndex; i++) {
		const value = data[i];

		if ('close' in value) {
			result[resultIndex] =  { time: value.time, value: ((value.close * weight) + value.high + value.low) / (2 + weight) };
		} else {
			result[resultIndex] = { time: value.time };
		}

		resultIndex += 1;
	}

	for (let i = endIndex; i < data.length; i++) {
		result[resultIndex] = { time: data[i].time };
		resultIndex += 1;
	}

	return result;
}