export function u8ViewToString(u8View: Uint8Array): string {
	const offset = 1 - (u8View.length % 2)
	const resultU8View = new Uint8Array(u8View.length + offset + 1)

	resultU8View[0] = offset
	resultU8View.set(u8View, offset + 1)

	return String.fromCharCode(...new Uint16Array(resultU8View.buffer))
}

export function stringToArrayBuffer(string: string): ArrayBuffer {
	const u16Array = new Uint16Array(string.split(``).map(char => char.charCodeAt(0)))

	return u16Array.buffer.slice((u16Array[0]! & 0xFF) + 1)
}
