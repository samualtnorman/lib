import { countBigIntDigits } from "./countBigIntDigits"

export class BigFloat {
	constructor(public mantissa = 0n, public exponent = 0n) {}

	toBigInt() {
		return this.exponent < 0n ? this.mantissa / (2n ** -this.exponent) : this.mantissa * (2n ** this.exponent)
	}

	toNumber(): number {
		if (this.exponent < 0n)
			return Number(this.mantissa) / Number(2n ** -this.exponent)

		return Number(this.toBigInt())
	}

	toString(): string {
		if (!this.exponent)
			return this.exponent.toString()

		if (this.exponent > 0n)
			return (this.mantissa * (2n ** this.exponent)).toString()

		const twoToPowerOfMinusExponent = 2n ** -this.exponent
		const base10Exponent = countBigIntDigits(twoToPowerOfMinusExponent)
		const digits = ((this.mantissa * (10n ** base10Exponent)) / twoToPowerOfMinusExponent).toString()
		const base10ExponentNegativeNumber = Number(-base10Exponent)

		return `${digits.slice(0, base10ExponentNegativeNumber)}.${digits.slice(base10ExponentNegativeNumber)}`
	}
}
