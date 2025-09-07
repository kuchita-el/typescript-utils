/**
 * Collection utilities and identity elements
 */

/**
 * Creates an empty Map with deferred type inference
 * 
 * This function leverages TypeScript's contextual typing to infer the correct
 * Map types based on usage context, solving type inference issues with `new Map()`.
 * 
 * @returns An empty Map with types inferred from context
 * 
 * @example
 * // Type is correctly inferred as Map<string, number>
 * const counts = items.reduce(countBy(item => item.category), emptyMap())
 * 
 * @example
 * // Without emptyMap, this would be Map<any, any>
 * const badCounts = items.reduce(countBy(item => item.category), new Map())
 */
export function emptyMap<K, V>(): Map<K, V> {
  return new Map<K, V>()
}

/**
 * Creates an empty Set with deferred type inference
 * 
 * This function leverages TypeScript's contextual typing to infer the correct
 * Set type based on usage context, solving type inference issues with `new Set()`.
 * 
 * @returns An empty Set with type inferred from context
 * 
 * @example
 * // Type is correctly inferred as Set<string>
 * const uniqueItems = items.reduce(someSetReducer, emptySet())
 */
export function emptySet<T>(): Set<T> {
  return new Set<T>()
}

/**
 * Creates an empty array with deferred type inference
 * 
 * This function leverages TypeScript's contextual typing to infer the correct
 * array type based on usage context, solving type inference issues with `[]`.
 * 
 * @returns An empty array with type inferred from context
 * 
 * @example
 * // Type is correctly inferred as string[]
 * const filtered = items.reduce(someFilterReducer, emptyArray())
 */
export function emptyArray<T>(): T[] {
  return []
}