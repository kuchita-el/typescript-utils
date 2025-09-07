/**
 * Tests for map reducer utilities
 */
import { describe, it, expect } from 'vitest'

import { emptyMap } from '../../collections'
import { toMap } from '../map'

describe('toMap', () => {
  const sampleData = [
    { id: 1, name: 'Alice', category: 'A' },
    { id: 2, name: 'Bob', category: 'B' },
    { id: 3, name: 'Charlie', category: 'A' }
  ]

  it('should convert array to Map with perfect type inference', () => {
    const result = sampleData.reduce(toMap(d => d.id, d => d.name), emptyMap())
    
    expect(result.get(1)).toBe('Alice')
    expect(result.get(2)).toBe('Bob')
    expect(result.get(3)).toBe('Charlie')
    expect(result.size).toBe(3)
  })

  it('should handle duplicate keys with default "last" strategy', () => {
    const dataWithDuplicates = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 1, name: 'Alice Updated' }
    ]
    
    const result = dataWithDuplicates.reduce(toMap(d => d.id, d => d.name), emptyMap())
    
    expect(result.get(1)).toBe('Alice Updated')
    expect(result.get(2)).toBe('Bob')
    expect(result.size).toBe(2)
  })

  it('should handle duplicate keys with "first" strategy', () => {
    const dataWithDuplicates = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 1, name: 'Alice Updated' }
    ]
    
    const result = dataWithDuplicates.reduce(
      toMap(d => d.id, d => d.name, { duplicateStrategy: 'first' }), 
      emptyMap()
    )
    
    expect(result.get(1)).toBe('Alice')
    expect(result.get(2)).toBe('Bob')
    expect(result.size).toBe(2)
  })

  it('should work with complex key and value transformations', () => {
    const result = sampleData.reduce(
      toMap(d => `user_${d.id.toString()}`, d => ({ name: d.name, category: d.category })), 
      emptyMap()
    )
    
    expect(result.get('user_1')).toEqual({ name: 'Alice', category: 'A' })
    expect(result.get('user_2')).toEqual({ name: 'Bob', category: 'B' })
    expect(result.size).toBe(3)
  })

  it('should handle empty arrays', () => {
    const emptyArray: { id: string, name: string }[] = []
    const result = emptyArray.reduce(toMap((d) => d.id, (d) => d.name), emptyMap())
    
    expect(result.size).toBe(0)
  })

  it('should work with primitive arrays', () => {
    const numbers = [1, 2, 3, 4, 5]
    const result = numbers.reduce(toMap(n => n, n => n * 2), emptyMap())
    
    expect(result.get(1)).toBe(2)
    expect(result.get(3)).toBe(6)
    expect(result.get(5)).toBe(10)
    expect(result.size).toBe(5)
  })
})
