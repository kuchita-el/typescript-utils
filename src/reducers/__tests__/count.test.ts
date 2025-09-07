/**
 * Tests for counting reducer utilities
 */
import { describe, it, expect } from 'vitest'

import { emptyMap } from '../../collections'
import { countBy } from '../count'

describe('countBy', () => {
  const sampleData = [
    { id: 1, name: 'Alice', category: 'A' },
    { id: 2, name: 'Bob', category: 'B' },
    { id: 3, name: 'Charlie', category: 'A' },
    { id: 4, name: 'David', category: 'C' },
    { id: 5, name: 'Eve', category: 'A' }
  ]

  it('should count by category with perfect type inference', () => {
    // Type inference test: should infer Map<string, number>
    const result = sampleData.reduce(countBy(d => d.category), emptyMap())
    
    expect(result.get('A')).toBe(3)
    expect(result.get('B')).toBe(1)
    expect(result.get('C')).toBe(1)
    expect(result.size).toBe(3)
  })

  it('should handle single category', () => {
    const data = [
      { category: 'A' },
      { category: 'A' },
      { category: 'A' }
    ]
    
    const result = data.reduce(countBy(d => d.category), emptyMap())
    
    expect(result.get('A')).toBe(3)
    expect(result.size).toBe(1)
  })

  it('should work with complex key functions', () => {
    const events = [
      { user: { id: 1, role: 'admin' }, action: 'login' },
      { user: { id: 2, role: 'user' }, action: 'view' },
      { user: { id: 1, role: 'admin' }, action: 'delete' },
      { user: { id: 3, role: 'admin' }, action: 'login' },
    ]
    
    // Type inference test: should infer Map<string, number> for template literal keys
    const result = events.reduce(countBy(item => `${item.user.role}:${item.action}`), emptyMap())
    
    expect(result.get('admin:login')).toBe(2)
    expect(result.get('admin:delete')).toBe(1)
    expect(result.get('user:view')).toBe(1)
    expect(result.size).toBe(3)
  })

  it('should work with numeric keys', () => {
    const scores = [
      { student: 'Alice', score: 85 },
      { student: 'Bob', score: 92 },
      { student: 'Charlie', score: 85 },
      { student: 'David', score: 78 },
      { student: 'Eve', score: 92 }
    ]
    
    // Type inference test: should infer Map<number, number>
    const result = scores.reduce(countBy(s => s.score), emptyMap())
    
    expect(result.get(85)).toBe(2)
    expect(result.get(92)).toBe(2)
    expect(result.get(78)).toBe(1)
    expect(result.size).toBe(3)
  })

  it('should handle empty arrays', () => {
    const emptyArray: { category: string }[] = []
    const result = emptyArray.reduce(countBy((d) => d.category), emptyMap())
    
    expect(result.size).toBe(0)
  })

  it('should work with boolean keys', () => {
    const users = [
      { name: 'Alice', isActive: true },
      { name: 'Bob', isActive: false },
      { name: 'Charlie', isActive: true },
      { name: 'David', isActive: true },
      { name: 'Eve', isActive: false }
    ]
    
    // Type inference test: should infer Map<boolean, number>
    const result = users.reduce(countBy(u => u.isActive), emptyMap())
    
    expect(result.get(true)).toBe(3)
    expect(result.get(false)).toBe(2)
    expect(result.size).toBe(2)
  })

  it('should handle null and undefined keys', () => {
    const data = [
      { category: 'A' },
      { category: null },
      { category: 'A' },
      { category: undefined },
      { category: null }
    ]

    const result = data.reduce(countBy(d => d.category), emptyMap())
    
    expect(result.get('A')).toBe(2)
    expect(result.get(null)).toBe(2)
    expect(result.get(undefined)).toBe(1)
    expect(result.size).toBe(3)
  })
})
