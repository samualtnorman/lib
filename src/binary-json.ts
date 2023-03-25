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
	Int24: 7,
	NegativeInt24: 8,
	Int32: 9,
	NegativeInt32: 10,
	Int40: 11,
	NegativeInt40: 12,
	Int48: 13,
	NegativeInt48: 14,
	Int56: 15,
	NegativeInt56: 16,
	Float: 17,
	String: 18,
	Array: 19,
	Object: 20
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
				let positive = true

				if (jsonValue < 0 || Object.is(jsonValue, -0)) {
					jsonValue = -jsonValue
					positive = false
				}

				if (jsonValue < 2 ** 8)
					return new Uint8Array([ positive ? JSONValueKind.Int8 : JSONValueKind.NegativeInt8, jsonValue ])

				if (jsonValue < 2 ** 16) {
					return new Uint8Array([
						positive ? JSONValueKind.Int16 : JSONValueKind.NegativeInt16,
						...new Uint8Array(new Uint16Array([ jsonValue ]).buffer)
					])
				}

				if (jsonValue < 2 ** 24) {
					return new Uint8Array([
						positive ? JSONValueKind.Int24 : JSONValueKind.NegativeInt24,
						...new Uint8Array(new Uint32Array([ jsonValue ]).buffer.slice(0, 3))
					])
				}

				if (jsonValue < 2 ** 32) {
					return new Uint8Array([
						positive ? JSONValueKind.Int32 : JSONValueKind.NegativeInt32,
						...new Uint8Array(new Uint32Array([ jsonValue ]).buffer)
					])
				}

				if (jsonValue < 2 ** 40) {
					return new Uint8Array([
						positive ? JSONValueKind.Int40 : JSONValueKind.NegativeInt40,
						...new Uint8Array(new BigUint64Array([ BigInt(jsonValue) ]).buffer.slice(0, 5))
					])
				}

				if (jsonValue < 2 ** 48) {
					return new Uint8Array([
						positive ? JSONValueKind.Int48 : JSONValueKind.NegativeInt48,
						...new Uint8Array(new BigUint64Array([ BigInt(jsonValue) ]).buffer.slice(0, 6))
					])
				}

				if (jsonValue < 2 ** 56) {
					return new Uint8Array([
						positive ? JSONValueKind.Int56 : JSONValueKind.NegativeInt56,
						...new Uint8Array(new BigUint64Array([ BigInt(jsonValue) ]).buffer.slice(0, 7))
					])
				}
			}

			return new Uint8Array([ JSONValueKind.Float, ...new Uint8Array(new Float64Array([ jsonValue ]).buffer) ])
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

		case JSONValueKind.Int8:
		case JSONValueKind.NegativeInt8: {
			const result = binaryJSON[index.$]

			assert(result != undefined, HERE)
			index.$++

			return kind == JSONValueKind.Int8 ? result : -result
		}

		case JSONValueKind.Int16:
		case JSONValueKind.NegativeInt16: {
			const result = new Uint16Array(binaryJSON.buffer.slice(index.$, index.$ + 2))[0]

			assert(result != undefined, HERE)
			index.$ += 2

			return kind == JSONValueKind.Int16 ? result : -result
		}

		case JSONValueKind.Int24:
		case JSONValueKind.NegativeInt24: {
			const result = new Uint32Array(new Uint8Array([ ...binaryJSON.slice(index.$, index.$ + 3), 0 ]).buffer)[0]

			assert(result != undefined, HERE)
			index.$ += 3

			return kind == JSONValueKind.Int24 ? result : -result
		}

		case JSONValueKind.Int32:
		case JSONValueKind.NegativeInt32: {
			const result = new Uint32Array(binaryJSON.buffer.slice(index.$, index.$ + 4))[0]

			assert(result != undefined, HERE)
			index.$ += 4

			return kind == JSONValueKind.Int32 ? result : -result
		}

		case JSONValueKind.Int40:
		case JSONValueKind.NegativeInt40: {
			const result = new BigUint64Array(new Uint8Array([ ...binaryJSON.slice(index.$, index.$ + 5), 0, 0, 0 ]).buffer)[0]

			assert(result != undefined, HERE)
			index.$ += 5

			return Number(kind == JSONValueKind.Int40 ? result : -result)
		}

		case JSONValueKind.Int48:
		case JSONValueKind.NegativeInt48: {
			const result = new BigUint64Array(new Uint8Array([ ...binaryJSON.slice(index.$, index.$ + 6), 0, 0 ]).buffer)[0]

			assert(result != undefined, HERE)
			index.$ += 6

			return Number(kind == JSONValueKind.Int48 ? result : -result)
		}

		case JSONValueKind.Int56:
		case JSONValueKind.NegativeInt56: {
			const result = new BigUint64Array(new Uint8Array([ ...binaryJSON.slice(index.$, index.$ + 7), 0 ]).buffer)[0]

			assert(result != undefined, HERE)
			index.$ += 7

			return Number(kind == JSONValueKind.Int56 ? result : -result)
		}

		case JSONValueKind.Float: {
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
