import type { JSONValue } from "."
import { assert } from "./assert"
import * as leb128 from "./leb128"

const JSONValueKind = {
	Null: 0,
	True: 1,
	False: 2,
	Int8: 3,
	NegativeInt8: 4,
	Int16: 5,
	NegativeInt16: 6,
	Int32: 7,
	NegativeInt32: 8,
	Float64: 9,
	String: 10,
	Array: 11,
	Object: 12
} as const

const textEncoder = new TextEncoder
const textDecoder = new TextDecoder

export function serialise(jsonValue: JSONValue): Uint8Array {
	// eslint-disable-next-line unicorn/no-null
	if (jsonValue == null)
		return new Uint8Array([ JSONValueKind.Null ])

	if (jsonValue === true)
		return new Uint8Array([ JSONValueKind.True ])

	if (jsonValue === false)
		return new Uint8Array([ JSONValueKind.False ])

	if (Array.isArray(jsonValue)) {
		const bytes = [ JSONValueKind.Array, ...leb128.fromBigInt(BigInt(jsonValue.length)) ]

		for (const item of jsonValue)
			bytes.push(...serialise(item))

		return new Uint8Array(bytes)
	}

	// eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
	switch (typeof jsonValue) {
		case `number`: {
			if (Number.isInteger(jsonValue)) {
				if (jsonValue < 0) {
					jsonValue = -jsonValue

					if (jsonValue < 1 << 8)
						return new Uint8Array([ JSONValueKind.NegativeInt8, jsonValue ])

					if (jsonValue < 1 << 16) {
						return new Uint8Array(
							[ JSONValueKind.NegativeInt16, ...new Uint8Array(new Uint16Array([ jsonValue ]).buffer) ]
						)
					}

					if (jsonValue < 2 ** 32) {
						return new Uint8Array(
							[ JSONValueKind.NegativeInt32, ...new Uint8Array(new Uint32Array([ jsonValue ]).buffer) ]
						)
					}
				}

				if (jsonValue < 1 << 8)
					return new Uint8Array([ JSONValueKind.Int8, jsonValue ])

				if (jsonValue < 1 << 16) {
					return new Uint8Array(
						[ JSONValueKind.Int16, ...new Uint8Array(new Uint16Array([ jsonValue ]).buffer) ]
					)
				}

				if (jsonValue < 2 ** 32) {
					return new Uint8Array(
						[ JSONValueKind.Int32, ...new Uint8Array(new Uint32Array([ jsonValue ]).buffer) ]
					)
				}
			}

			return new Uint8Array([ JSONValueKind.Float64, ...new Uint8Array(new Float64Array([ jsonValue ]).buffer) ])
		}

		case `string`: {
			return new Uint8Array([
				JSONValueKind.String,
				...leb128.fromBigInt(BigInt(jsonValue.length)),
				...textEncoder.encode(jsonValue)
			])
		}

		case `object`: {
			const entries = Object.entries(jsonValue)
			const bytes = [ JSONValueKind.Object, ...leb128.fromBigInt(BigInt(entries.length)) ]

			for (const [ key, value ] of entries)
				bytes.push(...leb128.fromBigInt(BigInt(key.length)), ...textEncoder.encode(key), ...serialise(value))

			return new Uint8Array(bytes)
		}
	}
}

// eslint-disable-next-line unicorn/no-object-as-default-parameter
export function deserialise(binaryJSON: Uint8Array, index: { $: number } = { $: 0 }): JSONValue {
	const kind = binaryJSON[index.$]

	index.$++

	// eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
	switch (kind) {
		case JSONValueKind.Null:
			// eslint-disable-next-line unicorn/no-null
			return null

		case JSONValueKind.True:
			return true

		case JSONValueKind.False:
			return false

		case JSONValueKind.Int8: {
			const result = binaryJSON[index.$]

			assert(result != undefined, HERE)
			index.$++

			return result
		}

		case JSONValueKind.NegativeInt8: {
			const result = binaryJSON[index.$]

			assert(result != undefined, HERE)
			index.$++

			return -result
		}

		case JSONValueKind.Int16: {
			const result = new Uint16Array(binaryJSON.buffer.slice(index.$, index.$ + 2))[0]

			assert(result != undefined, HERE)
			index.$ += 2

			return result
		}

		case JSONValueKind.NegativeInt16: {
			const result = new Uint16Array(binaryJSON.buffer.slice(index.$, index.$ + 2))[0]

			assert(result != undefined, HERE)
			index.$ += 2

			return -result
		}

		case JSONValueKind.Int32: {
			const result = new Uint32Array(binaryJSON.buffer.slice(index.$, index.$ + 4))[0]

			assert(result != undefined, HERE)
			index.$ += 4

			return result
		}

		case JSONValueKind.NegativeInt32: {
			const result = new Uint32Array(binaryJSON.buffer.slice(index.$, index.$ + 4))[0]

			assert(result != undefined, HERE)
			index.$ += 4

			return -result
		}

		case JSONValueKind.Float64: {
			const result = new Float64Array(binaryJSON.buffer.slice(index.$, index.$ + 8))[0]

			assert(result != undefined, HERE)
			index.$ += 8

			return result
		}

		case JSONValueKind.String: {
			const length = Number(leb128.toBigInt(binaryJSON, index))
			const result = textDecoder.decode(binaryJSON.slice(index.$, index.$ + length))

			index.$ += length

			return result
		}

		case JSONValueKind.Array: {
			const length = Number(leb128.toBigInt(binaryJSON, index))
			const result: JSONValue = new Array(length)

			for (let arrayIndex = 0; arrayIndex < length; arrayIndex++)
				result[arrayIndex] = deserialise(binaryJSON, index)

			return result
		}

		case JSONValueKind.Object: {
			const length = Number(leb128.toBigInt(binaryJSON, index))
			const result: JSONValue = {}

			for (let objectIndex = 0; objectIndex < length; objectIndex++) {
				const keyLength = Number(leb128.toBigInt(binaryJSON, index))
				const key = textDecoder.decode(binaryJSON.slice(index.$, index.$ + keyLength))

				index.$ += keyLength
				result[key] = deserialise(binaryJSON, index)
			}

			return result
		}
	}

	throw new Error(`Unknown JSONValueKind: ${kind}`)
}
