export function forEachParallel<I, O>(iterable: Iterable<I>, callback: (value: I) => Promise<O>) {
	const promises = []

	for (const value of iterable)
		promises.push(callback(value))

	return Promise.all(promises)
}

export default forEachParallel
