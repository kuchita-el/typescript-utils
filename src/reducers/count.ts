/**
 * Array.reduce() 用のカウントリデューサーユーティリティ
 */

/**
 * キーでグループ化した要素をカウントするリデューサーを作成する
 * @param keyFn 各要素からグルーピングキーを抽出する関数
 * @returns Array.reduce()用のリデューサー関数
 * 
 * @example
 * const items = [
 *   { category: 'A' },
 *   { category: 'B' },
 *   { category: 'A' },
 *   { category: 'C' }
 * ]
 * const result = items.reduce(countBy(item => item.category), emptyMap())
 * // Map { 'A' => 2, 'B' => 1, 'C' => 1 }
 */
export function countBy<T, K>(
  keyFn: (item: T) => K
): (acc: Map<K, number>, item: T) => Map<K, number> {
  return (acc: Map<K, number>, item: T): Map<K, number> => {
    const key = keyFn(item)
    const current = acc.get(key) ?? 0
    acc.set(key, current + 1)
    return acc
  }
}
