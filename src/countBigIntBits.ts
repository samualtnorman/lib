/** Count the number of bits needed to represent a bigint. */
export function countBigIntBits(bigint: bigint) {
	let bits = 0n

	while (bigint >= 2n ** bits)
		bits++

	return bits
}
