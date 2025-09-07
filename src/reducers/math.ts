/**
 * Mathematical reducer utilities for Array.reduce()
 */

/**
 * Types that support natural ordering comparison with < and > operators
 */
type Comparable = number | string | Date | bigint

/**
 * Creates a reducer that sums numeric values
 * @param transformFn Optional function to extract number from each element
 * @returns Reducer function for Array.reduce()
 * 
 * @example
 * [1, 2, 3].reduce(sum(), 0) // => 6
 * [{ value: 1 }, { value: 2 }].reduce(sum(item => item.value), 0) // => 3
 */
export function sum<T = number>(
  transformFn?: (item: T) => number
): (acc: number, item: T) => number {
  const fn = transformFn ?? ((item: T) => item as unknown as number)
  
  return (acc: number, item: T) => acc + fn(item)
}

/**
 * Creates a reducer that sums numeric values grouped by key
 * @param keyFn Function to extract grouping key from each element
 * @param valueFn Function to extract numeric value from each element
 * @returns Reducer function for Array.reduce()
 * 
 * @example
 * const sales = [
 *   { category: 'A', amount: 100 },
 *   { category: 'B', amount: 200 },
 *   { category: 'A', amount: 150 }
 * ]
 * const result = sales.reduce(sumBy(s => s.category, s => s.amount), emptyMap())
 * // Map { 'A' => 250, 'B' => 200 }
 */
export function sumBy<T, K>(
  keyFn: (item: T) => K,
  valueFn: (item: T) => number
): (acc: Map<K, number>, item: T) => Map<K, number> {
  return (acc: Map<K, number>, item: T) => {
    const key = keyFn(item)
    const value = valueFn(item)
    const current = acc.get(key) ?? 0
    acc.set(key, current + value)
    return acc
  }
}


/**
 * Creates a reducer that finds the minimum value
 * @param compareFn Optional comparison function (default: natural ordering for comparable types)
 * @returns Reducer function for Array.reduce()
 * 
 * @example
 * [3, 1, 2].reduce(min()) // => 1 (no initial value needed)
 * [{ age: 25 }, { age: 30 }].reduce(min((a, b) => a.age - b.age)) // requires comparison function
 */
// Overload 1: Non-comparable types require compareFn
export function min<T>(
  compareFn: (a: T, b: T) => number
): (acc: T, item: T) => T
// Overload 2: Comparable types can omit compareFn
export function min<T extends Comparable>(
  compareFn?: (a: T, b: T) => number
): (acc: T, item: T) => T
// Implementation
export function min<T>(
  compareFn?: (a: T, b: T) => number
): (acc: T, item: T) => T {
  const compare = compareFn ?? ((a: T, b: T) => {
    // This fallback only works for Comparable types
    if ((a) < (b)) return -1
    if ((a) > (b)) return 1
    return 0
  })
  
  return (acc: T, item: T) => {
    return compare(item, acc) < 0 ? item : acc
  }
}

/**
 * Creates a reducer that finds the maximum value
 * @param compareFn Optional comparison function (default: natural ordering for comparable types)
 * @returns Reducer function for Array.reduce()
 * 
 * @example
 * [3, 1, 2].reduce(max()) // => 3 (no initial value needed)
 * [{ age: 25 }, { age: 30 }].reduce(max((a, b) => a.age - b.age)) // requires comparison function
 */
// Overload 1: Non-comparable types require compareFn
export function max<T>(
  compareFn: (a: T, b: T) => number
): (acc: T, item: T) => T
// Overload 2: Comparable types can omit compareFn
export function max<T extends Comparable>(
  compareFn?: (a: T, b: T) => number
): (acc: T, item: T) => T
// Implementation
export function max<T>(
  compareFn?: (a: T, b: T) => number
): (acc: T, item: T) => T {
  const compare = compareFn ?? ((a: T, b: T) => {
    // This fallback only works for Comparable types
    if ((a) < (b)) return -1
    if ((a) > (b)) return 1
    return 0
  })
  
  return (acc: T, item: T) => {
    return compare(item, acc) > 0 ? item : acc
  }
}
