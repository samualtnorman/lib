export function countBigIntDigits(bigint: bigint): bigint {
	let digits = 0n

	while (bigint > 10n ** digits)
		digits++

	return digits
}
