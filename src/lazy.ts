export function lazy<T>(callback: () => T): () => T {
	let value: T
	let calledCallback = false

	return () => {
		if (calledCallback)
			return value

		value = callback()
		calledCallback = true

		return value
	}
}
