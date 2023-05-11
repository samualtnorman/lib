export function encode(data: { [index: number]: number, length: number }) {
	const result = new Uint8Array(Math.ceil(data.length * (8 / 7)))

	for (let index = data.length; index--;) {
		const resultIndex = Math.floor(index * (8 / 7))
		const offset = (index % 7) + 1

		result[resultIndex] |= data[index]! >> offset
		result[resultIndex + 1] |= ((data[index]! & ((1 << offset) - 1)) << 7) >> offset
	}

	return result
}
