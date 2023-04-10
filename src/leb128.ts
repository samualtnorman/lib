import { assert } from "./assert"
import { getBigIntWidth } from "./getBigIntWidth"

export function fromBigInt(integer: bigint): Uint8Array {
	const width = getBigIntWidth(integer)
	const u8View = new Uint8Array(Math.ceil(width / 7) + (width % 7 ? 0 : 1))

	for (const byteIndex of u8View.keys())
		u8View[byteIndex] = Number(((integer >> (BigInt(byteIndex) * 7n)) & 0b0111_1111n) | 0b1000_0000n)

	u8View[u8View.length - 1] = u8View[u8View.length - 1]! & 0b0111_1111

	return u8View
}

// eslint-disable-next-line unicorn/no-object-as-default-parameter
export function toBigInt(u8View: Uint8Array, index: { $: number } = { $: 0 }): bigint {
	let result = 0n
	let offset = 0n

	while (true) {
		const byte = u8View[index.$]

		assert(byte != undefined, HERE)
		result |= (BigInt(byte) & 0b0111_1111n) << offset
		index.$++
		offset += 7n

		if (!(byte & 0b1000_0000))
			return result
	}
}