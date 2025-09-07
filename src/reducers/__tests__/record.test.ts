/**
 * Tests for record reducer utilities
 */
import { describe, it, expect } from 'vitest'

import { toRecord } from '../record'

describe('toRecord', () => {
  const sampleData = [
    { id: 1, name: 'Alice', category: 'A' },
    { id: 2, name: 'Bob', category: 'B' },
    { id: 3, name: 'Charlie', category: 'A' }
  ]

  it('should convert array to Record with perfect type inference', () => {
    const result = sampleData.reduce(toRecord(d => String(d.id), d => d.name), {})
    
    expect(result['1']).toBe('Alice')
    expect(result['2']).toBe('Bob')
    expect(result['3']).toBe('Charlie')
    expect(Object.keys(result)).toHaveLength(3)
  })

  it('should handle duplicate keys (last value wins)', () => {
    const dataWithDuplicates = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 1, name: 'Alice Updated' }
    ]
    
    const result = dataWithDuplicates.reduce(toRecord(d => String(d.id), d => d.name), {})
    
    expect(result['1']).toBe('Alice Updated')
    expect(result['2']).toBe('Bob')
    expect(Object.keys(result)).toHaveLength(2)
  })

  it('should work with complex value transformations', () => {
    const result = sampleData.reduce(
      toRecord(d => String(d.id), d => ({ name: d.name, category: d.category })), 
      {}
    )
    
    expect(result['1']).toEqual({ name: 'Alice', category: 'A' })
    expect(result['2']).toEqual({ name: 'Bob', category: 'B' })
    expect(result['3']).toEqual({ name: 'Charlie', category: 'A' })
    expect(Object.keys(result)).toHaveLength(3)
  })

  it('should work with string keys directly', () => {
    const categories = [
      { name: 'electronics', count: 5 },
      { name: 'books', count: 10 },
      { name: 'clothing', count: 3 }
    ]
    
    const result = categories.reduce(toRecord(c => c.name, c => c.count), {})
    
    expect(result.electronics).toBe(5)
    expect(result.books).toBe(10)
    expect(result.clothing).toBe(3)
    expect(Object.keys(result)).toHaveLength(3)
  })

  it('should handle empty arrays', () => {
    const emptyArray: { id: string, name: string }[] = []
    const result = emptyArray.reduce(toRecord((d) => d.id, (d) => d.name), {} satisfies Record<string, string>)
    
    expect(Object.keys(result)).toHaveLength(0)
  })

  it('should work with primitive arrays', () => {
    const numbers = [1, 2, 3, 4, 5]
    const result = numbers.reduce(toRecord(n => String(n), n => n * 2), {})
    
    expect(result['1']).toBe(2)
    expect(result['3']).toBe(6)
    expect(result['5']).toBe(10)
    expect(Object.keys(result)).toHaveLength(5)
  })

  it('should preserve object reference in accumulator', () => {
    const initial = { existing: 'value' }
    const result = sampleData.reduce(toRecord(d => String(d.id), d => d.name), initial)
    
    expect(result).toBe(initial) // Same reference
    expect(result.existing).toBe('value')
    expect(result['1']).toBe('Alice')
  })
})
