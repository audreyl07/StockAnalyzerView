/**
 * closest-index.ts - Binary Search Utility with Caching
 * 
 * Provides efficient time-based lookups in sorted arrays using binary search.
 * Useful for finding the closest data point to a given timestamp.
 * 
 * Features:
 * - Binary search algorithm (O(log n) complexity)
 * - Result caching for repeated queries
 * - Configurable search direction (left/right)
 * - Type-safe with TypeScript generics
 * 
 * Use Cases:
 * - Aligning two time series with different timestamps
 * - Finding the closest historical data point to a specific time
 * - Correlation calculations between asynchronous data series
 */

/**
 * Search direction type
 * 'left' returns the index at or immediately after the target
 * 'right' returns the index at or immediately before the target
 */
export type SearchDirection = 'left' | 'right';

/**
 * Generic class for finding closest indices in time-sorted arrays
 * @template T - Must be an object with a numeric 'time' property
 */
export class ClosestTimeIndexFinder<T extends { time: number }> {
	private numbers: T[];
	private cache: Map<string, number>;

	/**
	 * Creates a new ClosestTimeIndexFinder
	 * @param sortedNumbers - Array of objects sorted by time (ascending order)
	 */
	constructor(sortedNumbers: T[]) {
		this.numbers = sortedNumbers;
		this.cache = new Map();
	}

	/**
	 * Finds the closest index for a target time
	 * Results are cached for performance on repeated queries
	 * 
	 * @param target - The target time to search for
	 * @param direction - Search direction ('left' or 'right')
	 * @returns The index of the closest element
	 * 
	 * @example
	 * const finder = new ClosestTimeIndexFinder(dataPoints);
	 * const index = finder.findClosestIndex(1609459200, 'left');
	 */
	public findClosestIndex(target: number, direction: SearchDirection): number {
		const cacheKey = `${target}:${direction}`;
		if (this.cache.has(cacheKey)) {
			return this.cache.get(cacheKey) as number;
		}

		// Perform search and cache result
		const closestIndex = this._performSearch(target, direction);

		this.cache.set(cacheKey, closestIndex);
		return closestIndex;
	}

	/**
	 * Binary search implementation
	 * @param target - The target time value
	 * @param direction - Which index to return when exact match not found
	 * @returns The closest index based on direction
	 */
	private _performSearch(target: number, direction: SearchDirection): number {
		let low = 0;
		let high = this.numbers.length - 1;

		// Handle edge cases
		if (target <= this.numbers[0].time) return 0;
		if (target >= this.numbers[high].time) return high;

		// Binary search
		while (low <= high) {
			const mid = Math.floor((low + high) / 2);
			const num = this.numbers[mid].time;

			if (num === target) {
				return mid;
			} else if (num > target) {
				high = mid - 1;
			} else {
				low = mid + 1;
			}
		}
		
		// No exact match: return based on direction
		// 'left' returns the next higher index, 'right' returns the next lower
		return direction === 'left' ? low : high;
	}
}