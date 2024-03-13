import { sum } from "./sum"

/** @example const string = concatenateU8Views(await asyncIterableToArray(childProcess.stdout)) */
export function concatenateU8Views(u8Views: Uint8Array[]): Uint8Array {
	const u8View = new Uint8Array(sum(u8Views.map(({ length }) => length)))
	let offset = 0

	for (const u8View of u8Views) {
		u8View.set(u8View, offset)
		offset += u8View.length
	}

	return u8View
}
