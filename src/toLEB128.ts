import getBigIntWidth from "./getBigIntWidth"

export function toLEB128(integer: bigint) {
	const width = getBigIntWidth(integer)
	const u8View = new Uint8Array(Math.ceil(width / 7) + (width % 7 ? 0 : 1))

	for (const byteIndex of u8View.keys())
		u8View[byteIndex] = Number((integer >> BigInt(byteIndex * 7)) & 0b0111_1111n) | 0b1000_0000

	u8View[u8View.length - 1] = u8View[u8View.length - 1]! & 0b0111_1111

	return u8View
}

export default toLEB128
