/**
 * timestamp-data.ts - Timestamp Validation Utility
 * 
 * Ensures that data arrays have valid numeric timestamps before being used with lightweight-charts.
 * lightweight-charts requires time values to be Unix timestamps in seconds (UTC).
 * 
 * Purpose:
 * - Runtime validation of data integrity
 * - Prevents chart errors from invalid time values
 * - Provides type safety for TypeScript
 * 
 * Common Issues This Prevents:
 * - String timestamps (e.g., "2023-01-01")
 * - Undefined or null time values
 * - Non-numeric time formats
 */

import { UTCTimestamp } from 'lightweight-charts';

type WithTime<V> = V & { time: unknown };

/**
 * Validates that all items in an array have numeric time properties
 * Throws an error if any item has a non-numeric time value
 * 
 * @template T - The data type
 * @template N - The timestamp type (extends UTCTimestamp)
 * @param data - Array of objects with time properties
 * @returns The same array, typed as having numeric timestamps
 * @throws {Error} If any item has a non-numeric time property
 * 
 * @example
 * const validatedData = ensureTimestampData(rawData);
 * // Now TypeScript knows all time values are numbers
 */
export function ensureTimestampData<T, N extends UTCTimestamp>(
	data: WithTime<T>[]
): (Omit<T, 'time'> & { time: N })[] {
	// Check each item
	for (const item of data) {
		if (typeof item.time !== 'number') {
			throw new Error('All items must have a numeric "time" property.');
		}
	}
	// Return with updated type
	return data as (Omit<T, 'time'> & { time: N })[];
}