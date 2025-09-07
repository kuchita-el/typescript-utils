/**
 * Map-related reducer utilities for Array.reduce()
 */

export type DuplicateStrategy = 'first' | 'last'

export interface ToMapOptions {
  duplicateStrategy?: DuplicateStrategy
}

/**
 * Creates a reducer that converts array elements to a Map
 * @param keyFn Function to extract key from each element
 * @param valueFn Function to extract value from each element
 * @param options Options including duplicate handling strategy
 * @returns Reducer function for Array.reduce()
 * 
 * @example
 * const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
 * const userMap = users.reduce(toMap(u => u.id, u => u.name), emptyMap())
 * // Map { 1 => 'Alice', 2 => 'Bob' }
 */
export function toMap<T, K, V>(
  keyFn: (item: T) => K,
  valueFn: (item: T) => V,
  options: ToMapOptions = {}
): (acc: Map<K, V>, item: T) => Map<K, V> {
  const { duplicateStrategy = 'last' } = options
  
  return (acc: Map<K, V>, item: T) => {
    const key = keyFn(item)
    const value = valueFn(item)
    
    if (duplicateStrategy === 'first' && acc.has(key)) {
      return acc
    }
    
    acc.set(key, value)
    return acc
  }
}