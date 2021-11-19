export function clamp(value: number, low: number, high: number) {
	return Math.max(Math.min(value, high), low)
}

export default clamp
