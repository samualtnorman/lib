export function lerp(a: number, b: number, amount: number) {
	return a + ((b - a) * amount)
}

export default lerp
