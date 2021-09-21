import { exec } from "child_process"

export function bufferToString(bufferU8View: Uint8Array) {
    const offset = 1 - (bufferU8View.length % 2)
    const u8View = new Uint8Array(bufferU8View.length + offset + 1)

    u8View[0] = offset
    u8View.set(bufferU8View, offset + 1)

    return String.fromCharCode(...new Uint16Array(u8View.buffer))
}

export function stringToBuffer(string: string) {
    const u8View = new Uint8Array(new Uint16Array(string.split("").map(char => char.charCodeAt(0))).buffer)
    return new Uint8Array(u8View.buffer, u8View[0] + 1)
}

export export function runCommand(command: string) {
	return new Promise<string>((resolve, reject) => {
		exec(command, (error, stdout) => {
			if (error)
				return reject(error)

			resolve(stdout)
		})
	})
}

export function* iterateXY(x = 0, y = 0): Generator<{ x: number, y: number }, never, never> {
	while (true) {
		yield { x, y }

		if (!x) {
			x = y + 1
			y = 0
		} else if (x > y)
			y++
		else
			x--
	}
}

export function sigmoid(input: number) {
	return 1 / (1 + (Math.E ** -input))
}

export function lerp(a: number, b: number, amount: number) {
	return a + ((b - a) * amount)
}

export function is<C extends Function>(object: {}, constructor: C): object is C["prototype"] {
	return Object.getPrototypeOf(object) == constructor.prototype
}

export class DynamicMap<K, V> extends Map<K, V> {
	constructor(private fallbackHandler: (key: K) => V) { super() }

	get(key: K) {
		if (super.has(key))
			return super.get(key)!

		const value = this.fallbackHandler(key)

		super.set(key, value)

		return value
	}
}


export class CustomError extends Error {
	name = this.constructor.name
}

export function assert(value: any, message = "assertion failed"): asserts value {
	if (!value)
		throw new Error(message)
}

export function tryCatch<CallbackReturn, CatchReturn>(callback: () => CallbackReturn, catchCallback: (error: unknown) => CatchReturn): CallbackReturn | CatchReturn
export function tryCatch<CallbackReturn, ThenReturn, CatchReturn>(callback: () => CallbackReturn, thenCallback: (callbackReturn: CallbackReturn) => ThenReturn, catchCallback: (error: unknown) => CatchReturn): ThenReturn | CatchReturn
export function tryCatch<CallbackReturn, ThenReturn, CatchReturn>(callback: () => CallbackReturn, thenOrCatchCallback: ((callbackReturn: CallbackReturn) => ThenReturn) & ((error: unknown) => CatchReturn), catchCallback?: (error: unknown) => CatchReturn) {
	let callbackReturn

	try {
		callbackReturn = callback()
	} catch (error) {
		return (catchCallback || thenOrCatchCallback)(error)
	}

	if (catchCallback)
		return thenOrCatchCallback(callbackReturn)

	return callbackReturn
}
