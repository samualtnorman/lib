export class BitStream {
	length = 0
	buffer: Uint8Array

	constructor(ensureSpace?: number)
	constructor(bitsToSet: (boolean | number)[])
	constructor(ensureSpaceOrBitsToSet: number | undefined | (boolean | number)[]) {
		if (Array.isArray(ensureSpaceOrBitsToSet)) {
			this.buffer = new Uint8Array(Math.ceil((ensureSpaceOrBitsToSet.length || 1) / 8))

			for (const element of ensureSpaceOrBitsToSet) {
				const byteIndex = Math.floor(this.length / 8)
				const byte = this.buffer[byteIndex]!
				const mask = 0b1000_0000 >> (this.length % 8)

				this.buffer[byteIndex] = element ? byte | mask : byte & ~mask
				this.length++
			}

			return
		}

		this.buffer = new Uint8Array(Math.ceil(ensureSpaceOrBitsToSet || 1) / 8)
	}

	ensureSpace(bitsToEnsure: number) {
		const minimumBufferLengthNeeded = Math.ceil((this.length + bitsToEnsure) / 8)

		if (this.buffer.length >= minimumBufferLengthNeeded)
			return

		let newBufferLength = this.buffer.length * 2

		while (newBufferLength < minimumBufferLengthNeeded)
			newBufferLength *= 2

		const oldBuffer = this.buffer

		this.buffer = new Uint8Array(newBufferLength)
		this.buffer.set(oldBuffer)

		return this
	}

	push(...elements: (boolean | number)[]) {
		this.ensureSpace(elements.length)

		for (const element of elements) {
			const byteIndex = Math.floor(this.length / 8)
			const byte = this.buffer[byteIndex]!
			const mask = 0b1000_0000 >> (this.length % 8)

			this.buffer[byteIndex] = element ? byte | mask : byte & ~mask
			this.length++
		}

		return this.length
	}

	*[Symbol.iterator]() {
		for (let index = 0; index < this.length; index++)
			yield Boolean(this.buffer[Math.floor(index / 8)]! & (0b1000_0000 >> (index % 8)))
	}

	pushByte(...bytes: number[]) {
		this.ensureSpace(bytes.length * 8)

		for (const byteToWrite of bytes) {
			for (let index = 8; index--;) {
				const byteIndex = Math.floor(this.length / 8)
				const byte = this.buffer[byteIndex]!
				const mask = 0b1000_0000 >> (this.length % 8)

				this.buffer[byteIndex] = (byteToWrite & (1 << index)) ? byte | mask : byte & ~mask
				this.length++
			}
		}

		return this.length
	}

	getBuffer() {
		return this.buffer.buffer.slice(0, Math.ceil(this.length / 8))
	}
}

export default BitStream
