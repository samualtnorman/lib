import { sum } from "./sum"

export function average(array: number[]): number {
	if (array.length)
		return sum(array) / array.length

	throw Error(`Cannot average empty array`)
}
