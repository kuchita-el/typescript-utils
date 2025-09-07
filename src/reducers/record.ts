/**
 * Object-related reducer utilities for Array.reduce()
 */


/**
 * Creates a reducer that converts array elements to an Object
 * @param keyFn Function to extract key from each element (must return string)
 * @param valueFn Function to extract value from each element
 * @returns Reducer function for Array.reduce()
 * 
 * @example
 * const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
 * const userRecord = users.reduce(toRecord(u => String(u.id), u => u.name), {})
 * // { '1': 'Alice', '2': 'Bob' }
 */
export function toRecord<T, V>(
  keyFn: (item: T) => string,
  valueFn: (item: T) => V
): (acc: Record<string, V>, item: T) => Record<string, V> {
  return (acc: Record<string, V>, item: T) => {
    const key = keyFn(item)
    const value = valueFn(item)
    acc[key] = value
    return acc
  }
}
