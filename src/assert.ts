import type { Falsy, NonFalsy } from "."

export class AssertError extends Error {}
Object.defineProperty(AssertError.prototype, `name`, { value: `AssertError` })

/** @example assert(typeof maybeString == "string", () => `Got ${typeof maybeString} instead of string`) */
export function assert<T>(value: T, message: ((value: T & Falsy) => string) | string = `assertion failed`): asserts value {
	if (!value)
		throw new AssertError(typeof message == `string` ? message : message(value as any))

	return value as any
}

/** Like typescript's non-null assertion operator (postfix `!`), but enforced at runtime.
  * @example ensure(objectOrUndefined, "Got undefined instead of object").property */
export const ensure = assert as <T>(value: T, message?: ((value: T & Falsy) => string) | string) => NonFalsy<T>
