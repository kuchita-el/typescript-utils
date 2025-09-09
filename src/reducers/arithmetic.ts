/**
 * Array.reduce() 用の算術演算リデューサーユーティリティ
 */

import type { ReducerFn } from './types'

/**
 * < と > 演算子で自然順序比較をサポートする型
 */
type Comparable = number | string | Date | bigint

/**
 * 数値を合計するリデューサーを作成する
 * @param transformFn 各要素から数値を抽出するオプション関数
 * @returns Array.reduce()用のリデューサー関数
 * 
 * @example
 * [1, 2, 3].reduce(sum(), 0) // => 6
 * [{ value: 1 }, { value: 2 }].reduce(sum(item => item.value), 0) // => 3
 */
export function sum<T = number>(
  transformFn?: (item: T) => number
): ReducerFn<T, number> {
  const fn = transformFn ?? ((item: T) => item as unknown as number)
  
  return (acc: number, item: T) => acc + fn(item)
}

/**
 * 最小値を見つけるリデューサーを作成する
 * @param compareFn オプションの比較関数（デフォルト：比較可能型の自然順序）
 * @returns Array.reduce()用のリデューサー関数
 * 
 * @example
 * [3, 1, 2].reduce(min()) // => 1 (初期値不要)
 * [{ age: 25 }, { age: 30 }].reduce(min((a, b) => a.age - b.age)) // 比較関数が必要
 */
// オーバーロード 1: 比較不可能型は compareFn が必要
export function min<T>(
  compareFn: (a: T, b: T) => number
): ReducerFn<T, T>
// オーバーロード 2: 比較可能型は compareFn を省略可能
export function min<T extends Comparable>(
  compareFn?: (a: T, b: T) => number
): ReducerFn<T, T>
// 実装
export function min<T>(
  compareFn?: (a: T, b: T) => number
): ReducerFn<T, T> {
  const compare = compareFn ?? ((a: T, b: T) => {
    // このフォールバックはComparable型のみで機能する
    if ((a) < (b)) return -1
    if ((a) > (b)) return 1
    return 0
  })
  
  return (acc: T, item: T) => {
    return compare(item, acc) < 0 ? item : acc
  }
}

/**
 * 最大値を見つけるリデューサーを作成する
 * @param compareFn オプションの比較関数（デフォルト：比較可能型の自然順序）
 * @returns Array.reduce()用のリデューサー関数
 * 
 * @example
 * [3, 1, 2].reduce(max()) // => 3 (初期値不要)
 * [{ age: 25 }, { age: 30 }].reduce(max((a, b) => a.age - b.age)) // 比較関数が必要
 */
// オーバーロード 1: 比較不可能型は compareFn が必要
export function max<T>(
  compareFn: (a: T, b: T) => number
): ReducerFn<T, T>
// オーバーロード 2: 比較可能型は compareFn を省略可能
export function max<T extends Comparable>(
  compareFn?: (a: T, b: T) => number
): ReducerFn<T, T>
// 実装
export function max<T>(
  compareFn?: (a: T, b: T) => number
): ReducerFn<T, T> {
  const compare = compareFn ?? ((a: T, b: T) => {
    // このフォールバックはComparable型のみで機能する
    if ((a) < (b)) return -1
    if ((a) > (b)) return 1
    return 0
  })
  
  return (acc: T, item: T) => {
    return compare(item, acc) > 0 ? item : acc
  }
}