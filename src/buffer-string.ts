export function u8ViewToString(u8View: Uint8Array): string {
	const offset = 1 - (u8View.length % 2)
	const u8View = new Uint8Array(u8View.length + offset + 1)

	u8View[0] = offset
	u8View.set(u8View, offset + 1)

	return String.fromCharCode(...new Uint16Array(u8View.buffer))
}

export function stringToArrayBuffer(string: string): ArrayBuffer {
	const u16Array = new Uint16Array(string.split(``).map(char => char.charCodeAt(0)))

	return u16Array.buffer.slice((u16Array[0]! & 0xFF) + 1)
}
