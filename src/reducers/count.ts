/**
 * Array.reduce() 用のカウントリデューサーユーティリティ
 */

import type { AggregatorFn } from './aggregate'

/**
 * 要素をカウントするAggregatorFnを作成する
 * @returns Array.reduce()用のリデューサー関数
 * 
 * @example
 * const items = [1, 2, 3, 4, 5]
 * const result = items.reduce(count(), 0)
 * // => 5
 * 
 * // groupByと組み合わせて使用（countByの代替）
 * import { groupBy } from './aggregate'
 * import { emptyMap } from '../collections'
 * 
 * const categoryData = [
 *   { category: 'A' },
 *   { category: 'B' },
 *   { category: 'A' },
 *   { category: 'C' }
 * ]
 * const result = categoryData.reduce(groupBy(item => item.category, count(), 0), emptyMap())
 * // Map { 'A' => 2, 'B' => 1, 'C' => 1 }
 */
export function count<T>(): AggregatorFn<T, number> {
  return (acc: number) => acc + 1
}
