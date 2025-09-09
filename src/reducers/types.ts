/**
 * Array.reduce() 用の型定義
 */

/**
 * Array.reduce()で使用するReducer関数の型定義
 * 
 * この型は、累積値(acc)と現在の要素(item)を受け取り、
 * 新しい累積値を返す関数を表します。
 * Array.reduce()メソッドのreducer引数と同じシグネチャです。
 * 
 * @template T 配列要素の型
 * @template V 累積値の型
 * 
 * @example
 * // 数値の合計を計算するReducerFn
 * const sumReducer: ReducerFn<number, number> = (acc, item) => acc + item
 * 
 * // 文字列の長さを累積するReducerFn
 * const lengthReducer: ReducerFn<string, number> = (acc, item) => acc + item.length
 */
export type ReducerFn<T, V> = (acc: V, item: T) => V