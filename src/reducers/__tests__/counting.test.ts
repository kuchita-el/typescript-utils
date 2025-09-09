/**
 * Tests for counting reducer utilities
 */
import { describe, it, expect } from 'vitest'

import { emptyMap } from '../../collections'
import { reduceBy } from '../combine'
import { count } from '../counting'

describe('count', () => {
  const sampleData = [
    { id: 1, name: 'Alice', category: 'A' },
    { id: 2, name: 'Bob', category: 'B' },
    { id: 3, name: 'Charlie', category: 'A' },
    { id: 4, name: 'David', category: 'C' },
    { id: 5, name: 'Eve', category: 'A' }
  ]

  it('should count elements directly', () => {
    const result = sampleData.reduce(count(), 0)
    expect(result).toBe(5)
  })

  it('should count by category using reduceBy + count', () => {
    // Type inference test: should infer Map<string, number>
    const result = sampleData.reduce(reduceBy(
      d => d.category,
      count(),
      0
    ), emptyMap())
    
    expect(result.get('A')).toBe(3)
    expect(result.get('B')).toBe(1)
    expect(result.get('C')).toBe(1)
    expect(result.size).toBe(3)
  })

  it('should handle single category using reduceBy + count', () => {
    const data = [
      { category: 'A' },
      { category: 'A' },
      { category: 'A' }
    ]
    
    const result = data.reduce(reduceBy(
      d => d.category,
      count(),
      0
    ), emptyMap())
    
    expect(result.get('A')).toBe(3)
    expect(result.size).toBe(1)
  })

  it('should work with complex key functions using reduceBy + count', () => {
    const events = [
      { user: { id: 1, role: 'admin' }, action: 'login', timestamp: 1000 },
      { user: { id: 2, role: 'user' }, action: 'view', timestamp: 2000 },
      { user: { id: 1, role: 'admin' }, action: 'login', timestamp: 3000 },
      { user: { id: 3, role: 'user' }, action: 'delete', timestamp: 4000 },
    ]
    
    // Type inference test: should infer Map<string, number> for template literal keys
    const result = events.reduce(reduceBy(
      item => `${item.user.role}:${item.action}`,
      count(),
      0
    ), emptyMap())
    
    expect(result.get('admin:login')).toBe(2)
    expect(result.get('user:view')).toBe(1)
    expect(result.get('user:delete')).toBe(1)
    expect(result.size).toBe(3)
  })

  it('should work with numeric keys using reduceBy + count', () => {
    const scores = [
      { name: 'Alice', score: 85 },
      { name: 'Bob', score: 90 },
      { name: 'Charlie', score: 85 }
    ]
    
    // Type inference test: should infer Map<number, number>
    const result = scores.reduce(reduceBy(
      s => s.score,
      count(),
      0
    ), emptyMap())
    
    expect(result.get(85)).toBe(2)
    expect(result.get(90)).toBe(1)
    expect(result.size).toBe(2)
  })

  it('should handle empty arrays', () => {
    const emptyArray: { category: string }[] = []
    const result = emptyArray.reduce(reduceBy(
      (d) => d.category,
      count(),
      0
    ), emptyMap())
    
    expect(result.size).toBe(0)
  })

  it('should work with boolean keys using reduceBy + count', () => {
    const users = [
      { name: 'Alice', isActive: true },
      { name: 'Bob', isActive: false },
      { name: 'Charlie', isActive: true },
      { name: 'David', isActive: true }
    ]
    
    // Type inference test: should infer Map<boolean, number>
    const result = users.reduce(reduceBy(
      u => u.isActive,
      count(),
      0
    ), emptyMap())
    
    expect(result.get(true)).toBe(3)
    expect(result.get(false)).toBe(1)
    expect(result.size).toBe(2)
  })
})