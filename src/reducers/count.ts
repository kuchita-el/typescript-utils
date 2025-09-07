/**
 * Counting reducer utilities for Array.reduce()
 */

import { emptyMap } from '../collections'

/**
 * Creates a reducer that counts elements grouped by key
 * @param keyFn Function to extract grouping key from each element
 * @returns Reducer function for Array.reduce()
 * 
 * @example
 * const items = [
 *   { category: 'A' },
 *   { category: 'B' },
 *   { category: 'A' },
 *   { category: 'C' }
 * ]
 * const result = items.reduce(countBy(item => item.category), emptyMap())
 * // Map { 'A' => 2, 'B' => 1, 'C' => 1 }
 */
export function countBy<T, K>(
  keyFn: (item: T) => K
): (acc: Map<K, number>, item: T) => Map<K, number> {
  return (acc: Map<K, number>, item: T): Map<K, number> => {
    const key = keyFn(item)
    const current = acc.get(key) ?? 0
    acc.set(key, current + 1)
    return acc
  }
}

/**
 * Helper function for better type inference with countBy
 * @param array The array to count elements from
 * @param keyFn Function to extract grouping key from each element  
 * @returns Map with counts by key
 * 
 * @example
 * const result = countByArray(users, u => u.category)
 * // Perfect type inference: Map<string, number>
 */
export function countByArray<T, K>(
  array: readonly T[],
  keyFn: (item: T) => K
): Map<K, number> {
  return array.reduce(countBy(keyFn), emptyMap())
}
