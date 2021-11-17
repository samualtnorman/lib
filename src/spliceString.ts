export function spliceString(string: string, toInsert: string, index: number, length = 0) {
	return string.slice(0, index) + toInsert + string.slice(index + length)
}

export default spliceString
