export function bufferToString(bufferU8View: Uint8Array) {
	const offset = 1 - (bufferU8View.length % 2)
	const u8View = new Uint8Array(bufferU8View.length + offset + 1)

	u8View[0] = offset
	u8View.set(bufferU8View, offset + 1)

	return String.fromCharCode(...new Uint16Array(u8View.buffer))
}

export function stringToBuffer(string: string) {
	const u16Array = new Uint16Array(string.split(``).map(char => char.charCodeAt(0)))

	return new Uint8Array(u16Array.buffer.slice((u16Array[0]! & 0xFF) + 1))
}
