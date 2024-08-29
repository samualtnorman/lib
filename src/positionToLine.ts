export function positionToLine(positionIndex: number, string: string): number {
	for (const [ lineNumber, { length } ] of string.split(`\n`).entries()) {
		positionIndex -= length + 1

		if (positionIndex < 0)
			return lineNumber + 1
	}

	throw Error(`\`positionIndex\` must be smaller than \`string\`'s length`)
}
