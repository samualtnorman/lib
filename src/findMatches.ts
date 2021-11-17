export function* findMatches(regex: RegExp, string: string) {
	let current

	while (current = regex.exec(string))
		yield { index: current.index, match: current[0] }
}

export default findMatches
