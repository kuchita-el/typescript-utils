/**
 * Array.reduce() 用のObject関連リデューサーユーティリティ
 */


/**
 * 配列要素をObjectに変換するリデューサーを作成する
 * @param keyFn 各要素からキーを抽出する関数（stringを返す必要あり）
 * @param valueFn 各要素から値を抽出する関数
 * @returns Array.reduce()用のリデューサー関数
 * 
 * @example
 * const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
 * const userRecord = users.reduce(toRecord(u => String(u.id), u => u.name), {})
 * // { '1': 'Alice', '2': 'Bob' }
 */
export function toRecord<T, V>(
  keyFn: (item: T) => string,
  valueFn: (item: T) => V
): (acc: Record<string, V>, item: T) => Record<string, V> {
  return (acc: Record<string, V>, item: T) => {
    const key = keyFn(item)
    const value = valueFn(item)
    acc[key] = value
    return acc
  }
}
