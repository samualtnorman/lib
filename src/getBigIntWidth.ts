export function getBigIntWidth(bigint: bigint) {
	if (bigint < 0n)
		bigint = -bigint

	let length = 0

	do {
		bigint >>= 1n
		length++
	} while (bigint)

	return length
}

export default getBigIntWidth
