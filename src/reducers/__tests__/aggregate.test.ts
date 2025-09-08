/**
 * Tests for aggregation reducer utilities
 */
import { describe, it, expect } from 'vitest'

import { emptyMap } from '../../collections'
import { aggregate, groupBy } from '../aggregate'
import { count } from '../count'
import { sum } from '../math'

describe('aggregate', () => {
  interface SampleData { id: number; name: string; category: string; value: number; }
  const sampleData: SampleData[] = [
    { id: 1, name: 'Alice', category: 'A', value: 100 },
    { id: 2, name: 'Bob', category: 'B', value: 200 },
    { id: 3, name: 'Charlie', category: 'A', value: 150 }
  ]

  it('should aggregate multiple properties simultaneously', () => {
    const result = sampleData.reduce(aggregate({
      totalValue: (acc: number, item: SampleData) => acc + item.value,
      count: (acc: number) => acc + 1,
      maxValue: (acc: number, item: SampleData) => Math.max(acc, item.value)
    }), { totalValue: 0, count: 0, maxValue: 0 })
    
    expect(result).toEqual({ 
      totalValue: 450, 
      count: 3, 
      maxValue: 200 
    })
  })

  it('should work with complex aggregations', () => {
    interface Transaction{ sales: number, cost: number };
    const transactions: Transaction[] = [
      { sales: 100, cost: 60 },
      { sales: 200, cost: 120 },
      { sales: 150, cost: 90 }
    ]
    
    const result = transactions.reduce(aggregate({
      totalSales: (acc: number, t) => acc + t.sales,
      totalCost: (acc: number, t) => acc + t.cost,
      profit: (acc: number, t) => acc + (t.sales - t.cost)
    }), { totalSales: 0, totalCost: 0, profit: 0 })
    
    expect(result).toEqual({ 
      totalSales: 450, 
      totalCost: 270, 
      profit: 180 
    })
  })

  it('should handle empty arrays', () => {
    const initial = { total: 0, count: 0 }
    const emptyArray: { value: number }[] = []
    const result = emptyArray.reduce(aggregate({
      total: (acc: number, item) => acc + item.value,
      count: (acc: number) => acc + 1
    }), initial)
    
    expect(result).toEqual(initial)
  })

  it('should preserve non-aggregated properties', () => {
    const initial = { total: 0, count: 0, metadata: 'test' }
    const result = sampleData.reduce(aggregate({
      total: (acc: typeof initial['total'], item: typeof sampleData[number]) => acc + item.value,
      count: (acc: typeof initial['count'],) => acc + 1
    }), initial)
    
    expect('metadata' in result ? result.metadata : undefined).toBe('test')
    expect(result.total).toBe(450)
    expect(result.count).toBe(3)
  })
})

describe('groupBy', () => {
  const sampleData = [
    { id: 1, name: 'Alice', category: 'A', value: 100 },
    { id: 2, name: 'Bob', category: 'B', value: 200 },
    { id: 3, name: 'Charlie', category: 'A', value: 150 }
  ]

  it('should group and aggregate by category', () => {
    const result = sampleData.reduce(groupBy(
      item => item.category,
      (acc: { total: number; count: number }, item: typeof sampleData[number]) => ({
        total: acc.total + item.value,
        count: acc.count + 1
      }),
      { total: 0, count: 0 }
    ), emptyMap())
    
    expect(result.get('A')).toEqual({ total: 250, count: 2 })
    expect(result.get('B')).toEqual({ total: 200, count: 1 })
    expect(result.size).toBe(2)
  })

  it('should work with string keys', () => {
    const sales = [
      { region: 'North', sales: 100, cost: 60 },
      { region: 'South', sales: 200, cost: 120 },
      { region: 'North', sales: 150, cost: 90 }
    ]
    
    const result = sales.reduce(groupBy(
      s => s.region,
      (acc: { totalSales: number; totalCost: number }, item: typeof sales[number]) => ({
        totalSales: acc.totalSales + item.sales,
        totalCost: acc.totalCost + item.cost
      }),
      { totalSales: 0, totalCost: 0 }
    ), emptyMap())
    
    expect(result.get('North')).toEqual({ totalSales: 250, totalCost: 150 })
    expect(result.get('South')).toEqual({ totalSales: 200, totalCost: 120 })
    expect(result.size).toBe(2)
  })

  it('should handle single group', () => {
    const data = [
      { category: 'A', value: 100 },
      { category: 'A', value: 200 }
    ]
    
    const result = data.reduce(groupBy(
      item => item.category,
      (acc: number, item: typeof data[number]) => acc + item.value,
      0
    ), emptyMap())
    
    expect(result.get('A')).toBe(300)
    expect(result.size).toBe(1)
  })

  it('should handle empty arrays', () => {
    const emptyArray: { category: string, value: number }[] = []
    const result = emptyArray.reduce(groupBy(
      (item) => item.category,
      (acc: number, item) => acc + item.value,
      0
    ), emptyMap())
    
    expect(result.size).toBe(0)
  })

  it('should work with complex key functions', () => {
    const events = [
      { user: { id: 1, role: 'admin' }, action: 'login', timestamp: 1000 },
      { user: { id: 2, role: 'user' }, action: 'view', timestamp: 2000 },
      { user: { id: 1, role: 'admin' }, action: 'delete', timestamp: 3000 },
    ]
    
    const result = events.reduce(groupBy(
      item => `${item.user.role}:${item.action}`,
      (acc: number) => acc + 1,
      0
    ), emptyMap())
    
    expect(result.get('admin:login')).toBe(1)
    expect(result.get('admin:delete')).toBe(1)
    expect(result.get('user:view')).toBe(1)
    expect(result.size).toBe(3)
  })

  it('should work with groupBy + sum combination (replacing sumBy)', () => {
    const sampleData = [
      { id: 1, category: 'A', value: 100 },
      { id: 2, category: 'B', value: 200 },
      { id: 3, category: 'A', value: 150 }
    ]
    
    const result = sampleData.reduce(groupBy(
      item => item.category,
      sum((item: typeof sampleData[number]) => item.value),
      0
    ), emptyMap())
    
    expect(result.get('A')).toBe(250)
    expect(result.get('B')).toBe(200)
    expect(result.size).toBe(2)
  })

  it('should handle single category with groupBy + sum', () => {
    const data = [
      { category: 'A', value: 100 },
      { category: 'A', value: 200 }
    ]
    
    const result = data.reduce(groupBy(
      item => item.category,
      sum((item: typeof data[number]) => item.value),
      0
    ), emptyMap())
    
    expect(result.get('A')).toBe(300)
    expect(result.size).toBe(1)
  })

  it('should handle empty arrays with groupBy + sum', () => {
    const emptyArray: { category: string, value: number }[] = []
    const result = emptyArray.reduce(groupBy(
      item => item.category,
      sum((item: typeof emptyArray[number]) => item.value),
      0
    ), emptyMap())
    
    expect(result.size).toBe(0)
  })

  it('should work with groupBy + count combination (replacing countBy)', () => {
    const sampleData = [
      { id: 1, category: 'A' },
      { id: 2, category: 'B' },
      { id: 3, category: 'A' },
      { id: 4, category: 'C' }
    ]
    
    const result = sampleData.reduce(groupBy(
      item => item.category,
      count(),
      0
    ), emptyMap())
    
    expect(result.get('A')).toBe(2)
    expect(result.get('B')).toBe(1)
    expect(result.get('C')).toBe(1)
    expect(result.size).toBe(3)
  })

  it('should work with groupBy + min combination for values', () => {
    const sampleData = [
      { id: 1, category: 'A', value: 100 },
      { id: 2, category: 'B', value: 200 },
      { id: 3, category: 'A', value: 50 },
      { id: 4, category: 'B', value: 150 }
    ]
    
    // Track minimum values by category
    const result = sampleData.reduce(groupBy(
      item => item.category,
      (acc: number, item: typeof sampleData[number]) => Math.min(acc, item.value),
      Infinity
    ), emptyMap())
    
    expect(result.get('A')).toBe(50)
    expect(result.get('B')).toBe(150)
    expect(result.size).toBe(2)
  })

  it('should work with groupBy + max combination for values', () => {
    const sampleData = [
      { id: 1, category: 'A', value: 100 },
      { id: 2, category: 'B', value: 200 },
      { id: 3, category: 'A', value: 150 },
      { id: 4, category: 'B', value: 50 }
    ]
    
    // Track maximum values by category
    const result = sampleData.reduce(groupBy(
      item => item.category,
      (acc: number, item: typeof sampleData[number]) => Math.max(acc, item.value),
      -Infinity
    ), emptyMap())
    
    expect(result.get('A')).toBe(150)
    expect(result.get('B')).toBe(200)
    expect(result.size).toBe(2)
  })

  it('should demonstrate type safety with AggregatorFn constraint', () => {
    interface TestData {
      category: string
      value: number
    }
    
    const testData: TestData[] = [
      { category: 'X', value: 10 },
      { category: 'Y', value: 20 },
      { category: 'X', value: 30 }
    ]
    
    // These should all work with proper type inference
    const sumResult = testData.reduce(groupBy(
      item => item.category,
      sum((item: TestData) => item.value),
      0
    ), emptyMap())
    
    const countResult = testData.reduce(groupBy(
      item => item.category,
      count<TestData>(),
      0
    ), emptyMap())
    
    expect(sumResult.get('X')).toBe(40)
    expect(sumResult.get('Y')).toBe(20)
    expect(countResult.get('X')).toBe(2)
    expect(countResult.get('Y')).toBe(1)
  })
})
