/**
 * TypeScript ユーティリティライブラリ
 * 
 * TypeScriptプロジェクト用のユーティリティ関数集です。
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
 * オブジェクトを深い階層まで読み取り専用にする型
 * 
 * @template T - 読み取り専用にしたいオブジェクトの型
 * 
 * @example
 * type User = { name: string; settings: { theme: string } }
 * type ReadonlyUser = DeepReadonly<User>
 * // => { readonly name: string; readonly settings: { readonly theme: string } }
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

/**
 * オブジェクトの特定のプロパティをオプショナルにする型
 * 
 * @template T - ベースとなるオブジェクトの型
 * @template K - オプショナルにしたいプロパティのキー
 * 
 * @example
 * type User = { id: number; name: string; email: string }
 * type UserWithOptionalEmail = Optional<User, 'email'>
 * // => { id: number; name: string; email?: string }
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// Array.reduce() ユーティリティ
export * from './reducers/index'

// コレクションユーティリティ
export * from './collections'

// 便利のためすべてをdefaultとしてエクスポート
export default {
  identity
}