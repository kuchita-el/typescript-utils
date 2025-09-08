/**
 * Integration tests for reducers module exports
 */
import { describe, it, expect } from 'vitest'

import * as reducers from '../index'

describe('reducers module exports', () => {
  it('should export all map utilities', () => {
    expect(typeof reducers.toMap).toBe('function')
  })

  it('should export all record utilities', () => {
    expect(typeof reducers.toRecord).toBe('function')
  })

  it('should export all math utilities', () => {
    expect(typeof reducers.sum).toBe('function')
    expect(typeof reducers.min).toBe('function')
    expect(typeof reducers.max).toBe('function')
  })

  it('should export all aggregate utilities', () => {
    expect(typeof reducers.aggregate).toBe('function')
    expect(typeof reducers.groupBy).toBe('function')
  })

  it('should export all count utilities', () => {
    expect(typeof reducers.count).toBe('function')
  })

  it('should demonstrate complex chaining with multiple reducers', () => {
    const complexData = [
      { user: { id: 1, role: 'admin' }, action: 'login', timestamp: 1000, value: 100 },
      { user: { id: 2, role: 'user' }, action: 'view', timestamp: 2000, value: 200 },
      { user: { id: 1, role: 'admin' }, action: 'delete', timestamp: 3000, value: 150 },
      { user: { id: 3, role: 'user' }, action: 'login', timestamp: 4000, value: 300 },
    ]

    // Create a user map
    const userActions = complexData.reduce(
      reducers.toMap(item => item.user.id, item => item.action), 
      new Map()
    )

    // Count by role:action combination using groupBy + count
    const roleActionCounts = complexData.reduce(
      reducers.groupBy(
        item => `${item.user.role}:${item.action}`,
        reducers.count(),
        0
      ),
      new Map()
    )

    // Sum values by role using groupBy + sum combination
    const roleValues = complexData.reduce(
      reducers.groupBy(
        item => item.user.role,
        reducers.sum((item: typeof complexData[number]) => item.value),
        0
      ),
      new Map()
    )

    expect(userActions.get(1)).toBe('delete') // Last action wins
    expect(userActions.get(2)).toBe('view')
    expect(userActions.get(3)).toBe('login')

    expect(roleActionCounts.get('admin:login')).toBe(1)
    expect(roleActionCounts.get('admin:delete')).toBe(1)
    expect(roleActionCounts.get('user:view')).toBe(1)
    expect(roleActionCounts.get('user:login')).toBe(1)

    expect(roleValues.get('admin')).toBe(250)
    expect(roleValues.get('user')).toBe(500)
  })

  it('should work with main library exports from root index', async () => {
    // Test that reducers are properly exported from main index
    const mainExports = await import('../../index')
    
    expect(typeof mainExports.toMap).toBe('function')
    expect(typeof mainExports.sum).toBe('function')
    expect(typeof mainExports.aggregate).toBe('function')
    expect(typeof mainExports.count).toBe('function')
  })
})