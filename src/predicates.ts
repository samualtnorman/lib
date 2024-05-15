import type { JsonValue, Key } from "."

export type Predicate<T> = (value: any) => value is T
export type PredicateType<T> = T extends (value: any) => value is infer U ? U : never

export const isUndefined = (value: unknown): value is undefined => value === undefined
export const isTrue = (value: unknown): value is true => value === true
export const isFalse = (value: unknown): value is false => value === false
export const isBoolean = (value: unknown): value is boolean => typeof value == `boolean`
export const isNumber = (value: unknown): value is number => typeof value == `number`
export const isString = (value: unknown): value is string => typeof value == `string`
export const isNull = (value: unknown): value is null => value === null
export const isNullish = (value: unknown): value is undefined | null => value == null

export const ArraySchema = <T>(predicate: Predicate<T>) => (value: unknown): value is T[] =>
	Array.isArray(value) && value.every(value => predicate(value))

export const isUnknownRecord = (value: unknown): value is Record<Key, unknown> =>
	Boolean(value) && typeof value == `object` 

export const RecordSchema = <T>(predicate: Predicate<T>) => (value: unknown): value is Record<Key, T> =>
	isUnknownRecord(value) && Object.getOwnPropertyNames(value).every((name: Key) => predicate(value[name]))

export const ObjectSchema = <T extends Record<Key, Predicate<any>>>(schema: T) =>
	(value: unknown): value is { [K in keyof T]: PredicateType<T[K]> } =>
		isUnknownRecord(value) && Object.getOwnPropertyNames(schema).every((name: Key) => schema[name]!(value[name]))

export const UnionSchema = <T extends Predicate<any>>(predicates: T[]) =>
	(value: unknown): value is PredicateType<T> => predicates.some(predicate => predicate(value))

export const LazySchema = <T>(getter: () => Predicate<T>) => (value: unknown): value is T => getter()(value)

export const isJsonValue: Predicate<JsonValue> = UnionSchema([
	isNull,
	isBoolean,
	isNumber,
	isString,
	ArraySchema(LazySchema(() => isJsonValue)),
	RecordSchema(LazySchema(() => isJsonValue))
])
