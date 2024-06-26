export function encode(data: { [index: number]: number, length: number }): Uint8Array {
	const result = new Uint8Array(Math.ceil(data.length * (8 / 7)))

	for (let index = result.length; index--;) {
		const offset = (index % 8) + 1

		result[index] = (((data[Math.floor(index * (7 / 8))]!) << (8 - offset)) & 0x7F) +
			((data[Math.floor((index + 1) * (7 / 8))] || 0) >> offset)
	}

	return result
}

export function decode(data: { [index: number]: number, length: number }): Uint8Array {
	const result = new Uint8Array(Math.floor(data.length * (7 / 8)))

	for (let index = result.length; index--;) {
		const leftIndex = Math.floor(index * (8 / 7))
		const offset = (index % 7) + 1

		result[index] = ((data[leftIndex]!) << offset) + ((data[leftIndex + 1] || 0) >> (7 - offset))
	}

	return result
}
