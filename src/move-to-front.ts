export function encode(u8View: Uint8Array): void {
	const list = [ ...Array(256) ].map((_, index) => index)

	for (const [ index, byte ] of u8View.entries()) {
		const encodedByte = list.indexOf(byte)

		list.splice(encodedByte, 1)
		list.unshift(byte)
		u8View[index] = encodedByte
	}
}

export function decode(u8View: Uint8Array): void {
	const list = [ ...Array(256) ].map((_, index) => index)

	for (const [ viewIndex, byte ] of u8View.entries()) {
		const decodedByte = list[byte]!

		list.splice(byte, 1)
		list.unshift(decodedByte)
		u8View[viewIndex] = decodedByte
	}
}
