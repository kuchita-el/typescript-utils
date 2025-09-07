/**
 * TypeScript Utilities Library
 * 
 * A collection of utility functions for TypeScript projects.
 */

// Example utility function
export function identity<T>(value: T): T {
  return value
}

// Type utilities
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// Array.reduce() utilities
export * from './reducers/index'

// Collection utilities
export * from './collections'

// Export everything as default for convenience
export default {
  identity
}