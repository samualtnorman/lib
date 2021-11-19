
export function positionIndexToLineIndex(positionIndex: number, string: string) {
	for (const [ lineNumber, { length } ] of string.split("\n").entries()) {
		positionIndex -= length + 1

		if (positionIndex < 0)
			return lineNumber + 1
	}

	throw new Error("`positionIndex` must be smaller than `string`'s length")
}

export default positionIndexToLineIndex
