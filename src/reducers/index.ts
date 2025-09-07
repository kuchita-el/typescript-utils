/**
 * Array.reduce() utility functions
 * 
 * This module provides utility functions designed to be used with Array.reduce().
 * Each function returns a reducer function that provides perfect TypeScript type inference.
 * 
 * @example
 * // Perfect type inference - no type annotations needed!
 * const numbers = [1, 2, 3, 4, 5]
 * const total = numbers.reduce(sum(), 0) // => 15
 * 
 * const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
 * const userMap = users.reduce(toMap(u => u.id, u => u.name), emptyMap())
 * // => Map { 1 => 'Alice', 2 => 'Bob' }
 * 
 * const userRecord = users.reduce(toRecord(u => String(u.id), u => u.name), {})
 * // => { '1': 'Alice', '2': 'Bob' }
 * 
 * // Complex aggregations with perfect type inference
 * const categoryTotals = items.reduce(sumBy(i => i.category, i => i.value), emptyMap())
 * const stats = data.reduce(aggregate({
 *   total: (acc, item) => acc + item.value,
 *   count: (acc, _item) => acc + 1
 * }), { total: 0, count: 0 })
 */


// Map utilities
export { toMap } from './map'
export type { DuplicateStrategy, ToMapOptions } from './map'

// Record utilities  
export { toRecord } from './record'

// Mathematical utilities
export { sum, sumBy, average, getAverage, min, max } from './math'

// Aggregation utilities
export { aggregate, groupBy } from './aggregate'
export type { AggregatorFn, Aggregators } from './aggregate'

// Counting utilities
export { countBy } from './count'

