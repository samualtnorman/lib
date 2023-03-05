export type Key = keyof any
export type AnyFunction = (...args: any[]) => any
export type Resolver<T> = (value: T | PromiseLike<T>) => void
export type Rejecter = (reason?: unknown) => void
export type Async<T extends AnyFunction> = (...args: Parameters<T>) => Promise<ReturnType<T>>
export type JSONValue = null | boolean | number | string | JSONValue[] | { [k: string]: JSONValue }
export type Cloneable = undefined | null | boolean | number | string | Cloneable[] | { [k: string]: Cloneable } |
	ArrayBuffer | DataView | Date | Error | Map<Cloneable, Cloneable> | RegExp | Set<Cloneable> | Uint8ClampedArray |
	Uint8Array | Uint16Array | Uint32Array | BigUint64Array | Int8Array | Int16Array | Int32Array | BigInt64Array |
	Float32Array | Float64Array
export type LaxPartial<T> = { [K in keyof T]?: T[K] | undefined }
export type Slice1<T extends any[]> = T extends [ any, ...infer TRest ] ? TRest : never
export type NonFalsy<T> = T extends false | 0 | "" | null | undefined | 0n ? never : T
export type Pretty<T> = { [K in keyof T]: T[K] }
export type Intersect<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never
export type Values<T> = T[keyof T]
export type PickByValue<T, U> = { [K in keyof T as T[K] extends U ? K : never]: T[K] }
export type Entries<T> = { [K in keyof T]: [ K, T[K] ] }[keyof T]
export type FromEntries<U extends [ Key, any ]> = { [TEntry in U as TEntry[0]]: TEntry[1] }

export { assert } from "/assert"
export { asyncReplace } from "/asyncReplace"
export { BitStream } from "/BitStream"
export { bufferToString, stringToBuffer } from "/bufferToString"
export { clamp } from "/clamp"
export { clearObject } from "/clearObject"
export { combineAsyncGeneratorsParallel } from "/combineAsyncGeneratorsParallel"
export { copyFilePersistent } from "/copyFilePersistent"
export { countHackmudCharacters } from "/countHackmudCharacters"
export { createErrorClass } from "/createErrorClass"
export { createLock } from "/createLock"
export { deeplyEquals } from "/deeplyEquals"
export { DynamicMap } from "/DynamicMap"
export { findFiles } from "/findFiles"
export { findMatches } from "/findMatches"
export { getBigIntWidth } from "/getBigIntWidth"
export { getDeepObjectProperty } from "/getDeepObjectProperty"
export { is } from "/is"
export { isGenerator } from "/isGenerator"
export { isRecord } from "/isRecord"
export { iterateInParallel } from "/iterateInParallel"
export { iterateXY } from "/iterateXY"
export { lerp } from "/lerp"
export { memoizeFunction } from "/memoizeFunction"
export { objectHasOwn } from "/objectHasOwn"
export { positionToLine } from "/positionToLine"
export { raceAllPromises } from "/raceAllPromises"
export { retry } from "/retry"
export { shuffle } from "/shuffle"
export { sigmoid } from "/sigmoid"
export { spliceString } from "/spliceString"
export { toLEB128 } from "/toLEB128"
export { tryCatch } from "/tryCatch"
export { wait } from "/wait"
export { writeFilePersistent } from "/writeFilePersistent"
