/**
 * Array.reduce() ユーティリティ関数
 * 
 * このモジュールはArray.reduce()と一緒に使用するために設計されたユーティリティ関数を提供します。
 * 各関数は完璧なTypeScript型推論を提供するリデューサー関数を返します。
 * 
 * @example
 * // 完璧な型推論 - 型注釈不要！
 * const numbers = [1, 2, 3, 4, 5]
 * const total = numbers.reduce(sum(), 0) // => 15
 * 
 * const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
 * const userMap = users.reduce(toMap(u => u.id, u => u.name), emptyMap())
 * // => Map { 1 => 'Alice', 2 => 'Bob' }
 * 
 * const userRecord = users.reduce(toRecord(u => String(u.id), u => u.name), {})
 * // => { '1': 'Alice', '2': 'Bob' }
 * 
 * // 完璧な型推論を伴う複雑な集約
 * const categoryTotals = items.reduce(reduceBy(i => i.category, sum(i => i.value), 0), emptyMap())
 * const stats = data.reduce(aggregate({
 *   total: (acc, item) => acc + item.value,
 *   count: (acc, _item) => acc + 1
 * }), { total: 0, count: 0 })
 */

// 型定義
export type { ReducerFn } from './types'

// Map ユーティリティ
export { toMap } from './map'
export type { DuplicateStrategy, ToMapOptions } from './map'

// Record ユーティリティ
export { toRecord } from './record'

// 算術演算ユーティリティ
export { sum, min, max } from './arithmetic'

// 複数集約・組み合わせユーティリティ
export { aggregate, reduceBy } from './combine'
export type { Reducers } from './combine'

// カウントユーティリティ
export { count } from './counting'