/**
 * Array.reduce() 用の複数集約・組み合わせユーティリティ
 */

import type { ReducerFn } from './types'

export type Reducers<T, R extends Record<string, unknown>> = {
  [K in keyof R]: ReducerFn<T, R[K]>
}

/**
 * 複数のプロパティを同時に集約するリデューサーを作成する
 * 
 * 各reducer関数はReducerFn<T, V>型に準拠し、sum()やcount()などの
 * 標準的なreducer関数と組み合わせて使用できます。
 * 
 * パフォーマンス上の利点: 配列を1回だけスキャンして複数の統計を計算するため、
 * 個別の計算よりも効率的です。大きなデータセットで特に有効です。
 * 
 * @param reducers プロパティ名とReducerFn関数のマッピングを行うObject
 * @returns Array.reduce()用のリデューサー関数
 * 
 * @example
 * // 基本的な使用方法
 * const transactions = [
 *   { sales: 100, cost: 60 },
 *   { sales: 200, cost: 120 }
 * ]
 * 
 * const result = transactions.reduce(aggregate({
 *   totalSales: (acc, t) => acc + t.sales,
 *   totalCost: (acc, t) => acc + t.cost,
 *   profit: (acc, t) => acc + (t.sales - t.cost)
 * }), { totalSales: 0, totalCost: 0, profit: 0 })
 * // => { totalSales: 300, totalCost: 180, profit: 120 }
 * 
 * @example
 * // 標準的なReducerFn関数との組み合わせ
 * import { sum, count } from './arithmetic'
 * 
 * const items = [
 *   { category: 'A', value: 10 },
 *   { category: 'B', value: 20 },
 *   { category: 'A', value: 15 }
 * ]
 * 
 * const stats = items.reduce(aggregate({
 *   total: sum(item => item.value),
 *   count: count(),
 *   average: 0  // 後で計算
 * }), { total: 0, count: 0, average: 0 })
 * 
 * stats.average = stats.total / stats.count
 * // => { total: 45, count: 3, average: 15 }
 */
export function aggregate<T, R extends Record<string, unknown>>(
  reducers: Reducers<T, R>
): ReducerFn<T, R> {
  return (acc: R, item: T) => {
    const result = { ...acc }
    for (const key in reducers) {
      if (Object.prototype.hasOwnProperty.call(reducers, key)) {
        const reducerFn = reducers[key]
        result[key] = reducerFn(acc[key], item)
      }
    }
    return result
  }
}

/**
 * 要素をキーでグループ化し、各グループに集約を適用するリデューサーを作成する
 * 
 * この関数は3つの引数を受け取り、キー別にグルーピングしながら
 * 各グループに対してreducer関数を適用します。
 * 
 * @param keyFn 各要素からグルーピングキーを抽出する関数
 * @param reducerFn 各グループ内の値を集約するReducer関数
 * @param initialValue 各グループの集約の初期値
 * @returns Array.reduce()用のリデューサー関数
 * 
 * @example
 * const sales = [
 *   { category: 'A', sales: 100, cost: 60 },
 *   { category: 'B', sales: 200, cost: 120 },
 *   { category: 'A', sales: 150, cost: 90 }
 * ]
 * 
 * const result = sales.reduce(reduceBy(
 *   s => s.category,
 *   (acc, item) => ({
 *     totalSales: acc.totalSales + item.sales,
 *     totalCost: acc.totalCost + item.cost
 *   }),
 *   { totalSales: 0, totalCost: 0 }
 * ), emptyMap())
 * // Map {
 * //   'A' => { totalSales: 250, totalCost: 150 },
 * //   'B' => { totalSales: 200, totalCost: 120 }
 * // }
 */
export function reduceBy<T, K, V>(
  keyFn: (item: T) => K,
  reducerFn: ReducerFn<T, V>,
  initialValue: V
): ReducerFn<T, Map<K, V>> {
  return (acc: Map<K, V>, item: T) => {
    const key = keyFn(item)
    const current = acc.get(key) ?? initialValue
    acc.set(key, reducerFn(current, item))
    return acc
  }
}