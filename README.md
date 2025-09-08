# TypeScript Utils

TypeScriptプロジェクト用の型安全なユーティリティライブラリです。完璧な型推論を提供する`Array.reduce()`ユーティリティとコレクションヘルパー関数を含みます。

## 特徴

- 🔄 **Array.reduce()ユーティリティ**: 数学演算、集約、変換のためのリデューサー関数
- 📦 **コレクションヘルパー**: 型推論を遅延した空のコンテナ（Map、Set、Array）
- 🎯 **完璧な型推論**: TypeScriptの文脈的型付けを活用した型注釈不要の開発体験
- 🚀 **モダンなツール**: TypeScript 5.x、ESNext、ES Modules対応

## インストール

```bash
npm install typescript-utils
```

## 使用例

### 基本的な使用方法

```typescript
import {
  sum,
  groupBy,
  toMap,
  emptyMap,
  aggregate,
  count
} from 'typescript-utils'

// 数値の合計 - 型注釈不要！
const numbers = [1, 2, 3, 4, 5]
const total = numbers.reduce(sum(), 0) // => 15

// カテゴリ別の合計
const items = [
  { category: 'A', value: 10 },
  { category: 'B', value: 20 },
  { category: 'A', value: 15 }
]
const categoryTotals = items.reduce(
  groupBy(
    (item) => item.category,
    sum((item) => item.value),
    0
  ),
  emptyMap()
)
// => Map { 'A' => 25, 'B' => 20 }
```

### Mapとレコードの生成

```typescript
import { toMap, toRecord, emptyMap } from 'typescript-utils'

const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' }
]

// Map生成 - 完璧な型推論
const userMap = users.reduce(
  toMap(
    (u) => u.id,
    (u) => u.name
  ),
  emptyMap()
)
// => Map<number, string> { 1 => 'Alice', 2 => 'Bob' }

// Record生成
const userRecord = users.reduce(
  toRecord(
    (u) => String(u.id),
    (u) => u.email
  ),
  {}
)
// => { '1': 'alice@example.com', '2': 'bob@example.com' }
```

### 高度な集約

```typescript
import { aggregate, groupBy, count, emptyMap } from 'typescript-utils'

const data = [
  { category: 'A', value: 10, status: 'active' },
  { category: 'A', value: 20, status: 'inactive' },
  { category: 'B', value: 15, status: 'active' }
]

// 複雑な統計情報の集約
const stats = data.reduce(
  aggregate({
    total: (acc, item) => acc + item.value,
    count: (acc, _item) => acc + 1,
    average: null // 後で計算
  }),
  { total: 0, count: 0, average: 0 }
)

stats.average = stats.total / stats.count
// => { total: 45, count: 3, average: 15 }

// カテゴリ別のグループ化（要素を配列にまとめる場合は別の関数が必要）
// ここでは代わりにカテゴリ別カウントの例を示す
const categoryCounts = data.reduce(
  groupBy((item) => item.category, count(), 0),
  emptyMap()
)
// => Map<string, number> { 'A' => 2, 'B' => 1 }

// ステータス別のカウント
const statusCounts = data.reduce(
  groupBy((item) => item.status, count(), 0),
  emptyMap()
)
// => Map<string, number> { 'active' => 2, 'inactive' => 1 }
```

## API リファレンス

### Array.reduce() ユーティリティ

#### 数学演算

- `sum()` - 数値の合計を計算するリデューサー
- `min()` - 最小値を求めるリデューサー
- `max()` - 最大値を求めるリデューサー
- `count()` - 要素数をカウントするリデューサー

#### 変換

- `toMap(keyFn, valueFn, options?)` - 配列をMapに変換
- `toRecord(keyFn, valueFn)` - 配列をレコードオブジェクトに変換

#### 集約

- `aggregate(aggregators)` - 複数の集約を同時実行
- `groupBy(keyFn, aggregatorFn, initialValue)` - 要素をキー別にグループ化して集約

### コレクションヘルパー

#### 空コンテナ生成

- `emptyMap<K, V>()` - 型推論を遅延した空のMap
- `emptySet<T>()` - 型推論を遅延した空のSet
- `emptyArray<T>()` - 型推論を遅延した空の配列

#### ユーティリティ関数

- `identity<T>(value)` - 恒等関数（引数をそのまま返す）

### 型安全性のオプション

`toMap`では重複キーの処理方法を指定できます：

```typescript
const options = {
  duplicateStrategy: 'first' | 'last'
}
const result = items.reduce(toMap(keyFn, valueFn, options), emptyMap())
```

## 開発

### 必要条件

- Node.js 22.0.0以上
- TypeScript 5.x

### セットアップ

```bash
# 依存関係をインストール
npm install

# 開発モードで実行
npm run dev

# ビルド
npm run build
```

### スクリプト

```bash
# テスト実行
npm test

# カバレッジ付きテスト
npm run test:coverage

# 型チェック
npm run typecheck

# リント実行
npm run lint

# フォーマット
npm run format
```

### プロジェクト構成

```
src/
├── index.ts              # メインエクスポート
├── collections.ts        # コレクションヘルパー
└── reducers/            # Array.reduce()ユーティリティ
    ├── index.ts         # リデューサーエクスポート
    ├── math.ts          # 数学演算
    ├── map.ts           # Map変換
    ├── record.ts        # Record変換
    ├── aggregate.ts     # 集約関数
    ├── count.ts         # カウント関数
    └── __tests__/       # テストファイル
```

## 型推論の利点

このライブラリの最大の特徴は、TypeScriptの文脈的型付けを活用した完璧な型推論です：

```typescript
// ❌ 型注釈が必要な従来のreduce方法
const counts: Map<string, number> = items.reduce((acc, item) => {
  const key = item.category
  acc.set(key, (acc.get(key) || 0) + 1)
  return acc
}, new Map<string, number>()) // 型引数が必要

// ✅ 型注釈不要のライブラリ使用
const counts = items.reduce(
  groupBy((item) => item.category, count(), 0),
  emptyMap()
)
//    ^? Map<string, number> - 自動推論！
```

## ライセンス

ISC

## 作者

**Kuchita EL**

- Email: el.kuchita@gmail.com
- GitHub: [@kuchita-el](https://github.com/kuchita-el)
