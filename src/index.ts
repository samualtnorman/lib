export type Key = keyof any
export type AnyFunction = (...args: any[]) => any
export type Resolver<T> = (value: T | PromiseLike<T>) => void
export type Rejecter = (reason?: unknown) => void
export type Async<T extends AnyFunction> = (...args: Parameters<T>) => Promise<ReturnType<T>>
export type JsonValue = null | boolean | number | string | JsonValue[] | { [k: string]: JsonValue }

export type Cloneable = undefined | null | boolean | number | string | Cloneable[] | { [k: string]: Cloneable } |
	ArrayBuffer | DataView | Date | Error | Map<Cloneable, Cloneable> | RegExp | Set<Cloneable> | Uint8ClampedArray |
	Uint8Array | Uint16Array | Uint32Array | BigUint64Array | Int8Array | Int16Array | Int32Array | BigInt64Array |
	Float32Array | Float64Array

export type LaxPartial<T> = { [K in keyof T]?: T[K] | undefined }
export type Slice1<T extends any[]> = T extends [ any, ...infer TRest ] ? TRest : never
export type Falsy = false | "" | 0 | 0n | null | undefined
export type NonFalsy<T> = T extends Falsy ? never : T
export type Pretty<T> = { [K in keyof T]: T[K] }
export type Intersect<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never
export type Values<T> = T[keyof T]
export type PickByValue<T, U> = { [K in keyof T as T[K] extends U ? K : never]: T[K] }
export type Entries<T> = { [K in keyof T]: [ K, T[K] ] }[keyof T]
export type FromEntries<U extends [ Key, any ]> = { [TEntry in U as TEntry[0]]: TEntry[1] }
export type Replace<A, B> = Omit<A, keyof B> & B

export type UnionToIntersection<T> =
	(T extends any ? (_: T) => void : never) extends ((_: infer I) => void) ? I : never
