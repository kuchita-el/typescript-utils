# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

```bash
npm run dev          # Watch mode build
npm run build        # Production build
npm run clean        # Clean dist directory
```

### Testing

```bash
npm test                    # Run all tests
npm run test:coverage      # Run tests with coverage report
vitest src/reducers/__tests__/arithmetic.test.ts  # Run specific test file
```

### Code Quality

```bash
npm run lint            # Check linting
npm run lint:fix        # Fix linting issues automatically
npm run typecheck       # Type checking
npm run typecheck:build # Type check build configuration
npm run format          # Format markdown, JSON, YAML files
npm run format:check    # Check formatting without fixing
```

## Architecture

### Core Design Philosophy

This is a TypeScript utilities library focused on **perfect type inference** with `Array.reduce()` utilities. The library leverages TypeScript's contextual typing to eliminate the need for type annotations in most use cases.

### Module Structure

- `src/index.ts` - Main export hub
- `src/collections.ts` - Empty container helpers (`emptyMap`, `emptySet`, `emptyArray`, `identity`)
- `src/reducers/` - All reducer utilities for `Array.reduce()`
  - `arithmetic.ts` - Math operations (`sum`, `min`, `max`)
  - `map.ts` - Map conversion utilities (`toMap`)
  - `record.ts` - Record/object conversion (`toRecord`)
  - `combine.ts` - Multi-aggregation (`aggregate`, `reduceBy`)
  - `counting.ts` - Counting utilities (`count`)
  - `types.ts` - Type definitions (`ReducerFn`)

### Key Patterns

#### Type Inference Strategy

Functions return reducer functions that work with `Array.reduce()` while maintaining perfect type inference:

```typescript
// Instead of requiring type annotations:
// const result: Map<string, number> = ...

// Library enables:
const result = items.reduce(toMap(keyFn, valueFn), emptyMap())
//     ^? Automatically inferred as Map<string, number>
```

#### Empty Container Pattern

Use `emptyMap()`, `emptySet()`, `emptyArray()` instead of `new Map()`, `new Set()`, `[]` to enable deferred type inference:

```typescript
// ✅ Good - enables type inference
items.reduce(toMap(...), emptyMap())

// ❌ Avoid - requires type annotations
items.reduce(toMap(...), new Map<string, number>())
```

## Technical Configuration

### TypeScript

- **Target**: ESNext with Node.js 22+ requirement
- **Module System**: ESM with bundler module resolution
- **Strict Mode**: Full strict checking enabled
- **Path Mapping**: `@/*` → `src/*`

### Build System

- **Bundler**: tsup for dual CJS/ESM output
- **Test Runner**: Vitest with v8 coverage
- **Linting**: ESLint 9+ with typescript-eslint
- **Formatting**: Prettier for non-TS files

### Git Hooks

- **lint-staged**: Auto-fixes TypeScript files with ESLint, formats other files with Prettier
- **husky**: Manages pre-commit hooks

## Testing Strategy

Tests are co-located in `__tests__/` directories. Each reducer category has comprehensive test coverage focusing on:

- Type inference correctness
- Edge cases and error handling
- Performance characteristics
- Integration with `Array.reduce()`
