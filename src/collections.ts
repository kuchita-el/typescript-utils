/**
 * コレクションユーティリティと単位元素
 */

/**
 * 恒等関数 - 引数をそのまま返す
 * 
 * @template T - 入力と出力の型
 * @param value - 返す値
 * @returns 入力された値をそのまま返す
 * 
 * @example
 * const result = identity(42) // => 42
 * const str = identity("hello") // => "hello"
 */
export function identity<T>(value: T): T {
  return value
}

/**
 * 型推論を遅延した空のMapを作成する
 * 
 * この関数はTypeScriptの文脈的型付けを活用して、使用文脈に基づいて
 * 正しいMap型を推論し、`new Map()`の型推論の問題を解決します。
 * 
 * @returns 文脈から型が推論された空のMap
 * 
 * @example
 * // 型はMap<string, number>として正しく推論される
 * const counts = items.reduce(countBy(item => item.category), emptyMap())
 * 
 * @example
 * // emptyMapを使わない場合、これはMap<any, any>になってしまう
 * const badCounts = items.reduce(countBy(item => item.category), new Map())
 */
export function emptyMap<K, V>(): Map<K, V> {
  return new Map<K, V>()
}

/**
 * 型推論を遅延した空のSetを作成する
 * 
 * この関数はTypeScriptの文脈的型付けを活用して、使用文脈に基づいて
 * 正しいSet型を推論し、`new Set()`の型推論の問題を解決します。
 * 
 * @returns 文脈から型が推論された空のSet
 * 
 * @example
 * // 型はSet<string>として正しく推論される
 * const uniqueItems = items.reduce(someSetReducer, emptySet())
 */
export function emptySet<T>(): Set<T> {
  return new Set<T>()
}

/**
 * 型推論を遅延した空の配列を作成する
 * 
 * この関数はTypeScriptの文脈的型付けを活用して、使用文脈に基づいて
 * 正しい配列型を推論し、`[]`の型推論の問題を解決します。
 * 
 * @returns 文脈から型が推論された空の配列
 * 
 * @example
 * // 型はstring[]として正しく推論される
 * const filtered = items.reduce(someFilterReducer, emptyArray())
 */
export function emptyArray<T>(): T[] {
  return []
}