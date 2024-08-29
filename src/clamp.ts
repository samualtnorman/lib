/** @example n = clamp(n, 0, 10) */
export const clamp = (value: number, low: number, high: number): number => Math.max(Math.min(value, high), low)
