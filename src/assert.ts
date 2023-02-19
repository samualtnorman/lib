import createErrorClass from "./createErrorClass"

export const AssertError = createErrorClass(`AssertError`)

export function assert(value: any, message: (() => string) | string = `assertion failed`): asserts value {
	if (!value)
		throw new AssertError(typeof message == `string` ? message : message())

	return value
}

export default assert

export const ensure = assert as <T>(value: T | undefined | null | false | 0, message: (() => string) | string) => T
