export const spliceString = (string: string, toInsert: string, index: number, length = 0): string =>
	string.slice(0, index) + toInsert + string.slice(index + length)
