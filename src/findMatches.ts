import { assert } from "./assert"

export function* findMatches(regex: RegExp, string: string): Generator<{ index: number, match: string }, void, never> {
	assert(regex.global, `regex must have global flag`)

	let current

	while ((current = regex.exec(string)))
		yield { index: current.index, match: (current[1] || current[0])! }
}
