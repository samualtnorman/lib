export const getRandomU52 = (): number => Math.floor(Math.random() * (2 ** 52))

let buffer = BigInt(getRandomU52())
let bitsLeft = 52n

export function getRandomU(bits: bigint): bigint {
	while (bitsLeft < bits) {
		buffer |= BigInt(getRandomU52()) << bitsLeft
		bitsLeft += 52n
	}

	const result = buffer & ((1n << bits) - 1n)

	buffer >>= bits
	bitsLeft -= bits

	return result
}
