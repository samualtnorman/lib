import createErrorClass from "./createErrorClass"

export const AssertError = createErrorClass(`AssertError`)

export function assert(value: any, message = `assertion failed`): asserts value {
	if (!value)
		throw new AssertError(message)
}

export default assert

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export function ensure<T>(value: T | undefined | null | void, message = `ensure failed`): T {
	assert(value, message)

	return value
}
