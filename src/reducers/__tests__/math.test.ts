/**
 * Tests for mathematical reducer utilities
 */
import { describe, it, expect } from 'vitest'

import { emptyMap } from '../../collections'
import { sum, sumBy, min, max } from '../math'

describe('sum', () => {
  it('should sum primitive numbers', () => {
    const numbers = [1, 2, 3, 4, 5]
    const result = numbers.reduce(sum(), 0)
    
    expect(result).toBe(15)
  })

  it('should sum with transform function', () => {
    const sampleData = [
      { id: 1, value: 100 },
      { id: 2, value: 200 },
      { id: 3, value: 150 }
    ]
    
    const result = sampleData.reduce(sum(d => d.value), 0)
    
    expect(result).toBe(450)
  })

  it('should handle empty arrays', () => {
    const emptyArray: number[] = []
    const result = emptyArray.reduce(sum(), 0)
    
    expect(result).toBe(0)
  })

  it('should handle negative numbers', () => {
    const numbers = [-1, -2, 3, -4, 5]
    const result = numbers.reduce(sum(), 0)
    
    expect(result).toBe(1)
  })
})

describe('sumBy', () => {
  const sampleData = [
    { id: 1, category: 'A', value: 100 },
    { id: 2, category: 'B', value: 200 },
    { id: 3, category: 'A', value: 150 }
  ]

  it('should sum by category with perfect type inference', () => {
    const result = sampleData.reduce(sumBy(d => d.category, d => d.value), emptyMap())
    
    expect(result.get('A')).toBe(250)
    expect(result.get('B')).toBe(200)
    expect(result.size).toBe(2)
  })

  it('should handle single category', () => {
    const data = [
      { category: 'A', value: 100 },
      { category: 'A', value: 200 }
    ]
    
    const result = data.reduce(sumBy(d => d.category, d => d.value), emptyMap())
    
    expect(result.get('A')).toBe(300)
    expect(result.size).toBe(1)
  })

  it('should handle empty arrays', () => {
    const emptyArray: { category: string, value: number }[] = []
    const result = emptyArray.reduce(sumBy((d) => d.category, (d) => d.value), emptyMap())
    
    expect(result.size).toBe(0)
  })
})


describe('min', () => {
  it('should find minimum value without initial value', () => {
    const numbers = [5, 2, 8, 1, 9]
    const result = numbers.reduce(min())
    
    expect(result).toBe(1)
  })

  it('should work with custom comparison function', () => {
    const people = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
      { name: 'Charlie', age: 35 }
    ]
    
    const result = people.reduce(min((a, b) => a.age - b.age))
    
    expect(result).toEqual({ name: 'Bob', age: 25 })
  })

  it('should handle single element', () => {
    const numbers = [42]
    const result = numbers.reduce(min())
    
    expect(result).toBe(42)
  })

  it('should handle negative numbers', () => {
    const numbers = [-1, -5, -2, -8]
    const result = numbers.reduce(min())
    
    expect(result).toBe(-8)
  })

  it('should work with strings', () => {
    const words = ['zebra', 'apple', 'banana']
    const result = words.reduce(min())
    
    expect(result).toBe('apple')
  })

  it('should work with dates', () => {
    const dates = [
      new Date('2023-03-01'),
      new Date('2023-01-01'),
      new Date('2023-02-01')
    ]
    const result = dates.reduce(min())
    
    expect(result).toEqual(new Date('2023-01-01'))
  })

  it('should require comparison function for objects', () => {
    const people = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 }
    ]
    
    // This should work with comparison function
    const result = people.reduce(min((a, b) => a.age - b.age))
    expect(result).toEqual({ name: 'Bob', age: 25 })
    
    // Without comparison function, TypeScript should require it for object types
    // const resultError = people.reduce(min()) // This should be a TypeScript error
  })
})

describe('max', () => {
  it('should find maximum value without initial value', () => {
    const numbers = [5, 2, 8, 1, 9]
    const result = numbers.reduce(max())
    
    expect(result).toBe(9)
  })

  it('should work with custom comparison function', () => {
    const people = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
      { name: 'Charlie', age: 35 }
    ]
    
    const result = people.reduce(max((a, b) => a.age - b.age))
    
    expect(result).toEqual({ name: 'Charlie', age: 35 })
  })

  it('should handle single element', () => {
    const numbers = [42]
    const result = numbers.reduce(max())
    
    expect(result).toBe(42)
  })

  it('should handle negative numbers', () => {
    const numbers = [-1, -5, -2, -8]
    const result = numbers.reduce(max())
    
    expect(result).toBe(-1)
  })

  it('should work with strings', () => {
    const words = ['zebra', 'apple', 'banana']
    const result = words.reduce(max())
    
    expect(result).toBe('zebra')
  })

  it('should work with dates', () => {
    const dates = [
      new Date('2023-03-01'),
      new Date('2023-01-01'),
      new Date('2023-02-01')
    ]
    const result = dates.reduce(max())
    
    expect(result).toEqual(new Date('2023-03-01'))
  })

  it('should require comparison function for objects', () => {
    const people = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 35 }
    ]
    
    // This should work with comparison function
    const result = people.reduce(max((a, b) => a.age - b.age))
    expect(result).toEqual({ name: 'Bob', age: 35 })
    
    // Without comparison function, TypeScript should require it for object types
    // const resultError = people.reduce(max()) // This should be a TypeScript error
  })
})

