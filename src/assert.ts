import type { NonFalsy } from "."
import { createErrorClass } from "./createErrorClass"

export const AssertError = createErrorClass(`AssertError`)

/** @example assert(typeof maybeString == "string", () => `Got ${typeof maybeString} instead of string`) */
export function assert(value: any, message: (() => string) | string = `assertion failed`): asserts value {
	if (!value)
		throw new AssertError(typeof message == `string` ? message : message())

	return value
}

/** Like typescript's non-null assertion operator (postfix `!`), but enforced at runtime.
  * @example ensure(objectOrUndefined, "Got undefined instead of object").property */
export const ensure = assert as <T>(value: T, message?: (() => string) | string) => NonFalsy<T>
