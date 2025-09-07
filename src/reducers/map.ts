/**
 * Array.reduce() 用のMap関連リデューサーユーティリティ
 */

export type DuplicateStrategy = 'first' | 'last'

export interface ToMapOptions {
  duplicateStrategy?: DuplicateStrategy
}

/**
 * 配列要素をMapに変換するリデューサーを作成する
 * @param keyFn 各要素からキーを抽出する関数
 * @param valueFn 各要素から値を抽出する関数
 * @param options 重複処理戦略を含むオプション
 * @returns Array.reduce()用のリデューサー関数
 * 
 * @example
 * const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
 * const userMap = users.reduce(toMap(u => u.id, u => u.name), emptyMap())
 * // Map { 1 => 'Alice', 2 => 'Bob' }
 */
export function toMap<T, K, V>(
  keyFn: (item: T) => K,
  valueFn: (item: T) => V,
  options: ToMapOptions = {}
): (acc: Map<K, V>, item: T) => Map<K, V> {
  const { duplicateStrategy = 'last' } = options
  
  return (acc: Map<K, V>, item: T) => {
    const key = keyFn(item)
    const value = valueFn(item)
    
    if (duplicateStrategy === 'first' && acc.has(key)) {
      return acc
    }
    
    acc.set(key, value)
    return acc
  }
}