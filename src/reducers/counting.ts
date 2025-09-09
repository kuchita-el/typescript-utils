/**
 * Array.reduce() 用のカウント（計数）リデューサーユーティリティ
 */

import type { ReducerFn } from './types'

/**
 * 要素をカウントするReducerFnを作成する
 * @returns Array.reduce()用のリデューサー関数
 * 
 * @example
 * const items = [1, 2, 3, 4, 5]
 * const result = items.reduce(count(), 0)
 * // => 5
 * 
 * // reduceByと組み合わせて使用（旧countByの代替）
 * import { reduceBy } from './combine'
 * import { emptyMap } from '../collections'
 * 
 * const categoryData = [
 *   { category: 'A' },
 *   { category: 'B' },
 *   { category: 'A' },
 *   { category: 'C' }
 * ]
 * const result = categoryData.reduce(reduceBy(item => item.category, count(), 0), emptyMap())
 * // Map { 'A' => 2, 'B' => 1, 'C' => 1 }
 */
export function count<T>(): ReducerFn<T, number> {
  return (acc: number) => acc + 1
}