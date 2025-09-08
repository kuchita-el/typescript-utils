/**
 * Array.reduce() 用の集約リデューサーユーティリティ
 */

export type AggregatorFn<T, V> = (acc: V, item: T) => V

export type Aggregators<T, R extends Record<string, unknown>> = {
  [K in keyof R]: AggregatorFn<T, R[K]>
}

/**
 * 複数のプロパティを同時に集約するリデューサーを作成する
 * @param aggregators プロパティ名と集約関数のマッピングを行うObject
 * @param initialValue 集約の初期値（オプション）
 * @returns Array.reduce()用のリデューサー関数
 * 
 * @example
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
 */
export function aggregate<T, R extends Record<string, unknown>>(
  aggregators: Aggregators<T, R>
): (acc: R, item: T) => R {
  return (acc: R, item: T) => {
    const result = { ...acc }
    for (const key in aggregators) {
      if (Object.prototype.hasOwnProperty.call(aggregators, key)) {
        const aggregatorFn = aggregators[key]
        result[key] = aggregatorFn(acc[key], item)
      }
    }
    return result
  }
}

/**
 * 要素をキーでグループ化し、各グループに集約を適用するリデューサーを作成する
 * @param keyFn 各要素からグルーピングキーを抽出する関数
 * @param aggregatorFn 各グループ内の値を集約する関数
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
 * const result = sales.reduce(groupBy(
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
export function groupBy<T, K, V>(
  keyFn: (item: T) => K,
  aggregatorFn: AggregatorFn<T, V>,
  initialValue: V
): (acc: Map<K, V>, item: T) => Map<K, V> {
  return (acc: Map<K, V>, item: T) => {
    const key = keyFn(item)
    const current = acc.get(key) ?? initialValue
    acc.set(key, aggregatorFn(current, item))
    return acc
  }
}
