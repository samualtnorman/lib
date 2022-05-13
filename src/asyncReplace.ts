export async function asyncReplace(string: string, regexp: RegExp, replacer: (substring: string, ...arguments_: any[]) => Promise<string>) {
	const promises: Promise<string>[] = []

	string.replace(regexp, (match, ...arguments_) => {
		promises.push(replacer(match, ...arguments_))

		return match
	})

	const strings = await Promise.all(promises)
	let index = 0

	return string.replace(regexp, () => strings[index++]!)
}

export default asyncReplace
