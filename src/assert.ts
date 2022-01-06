import { createErrorClass } from "."

export const AssertError = createErrorClass(`AssertError`)

export function assert(value: any, message = `assertion failed`): asserts value {
	if (!value)
		throw new AssertError(message)
}

export default assert

export function ensure<T>(value: T | undefined | null, message = `ensure failed`): T {
	assert(value, message)

	return value
}
