export function* mapIterable<T, R>(iterable: Iterable<T>, callback: (item: T) => R): Generator<R, void, undefined> {
	for (const item of iterable)
		yield callback(item)
}

export function* filterIterable<T>(iterable: Iterable<T>, callback: (item: T) => boolean): Generator<T, void, undefined> {
	for (const item of iterable) {
		if (callback(item))
			yield item
	}
}

export function* toGenerator<T>(iterable: Iterable<T>): Generator<T, void, undefined> {
	for (const item of iterable)
		yield item
}

export function* iterateInParallel<A, B>(
	firstIterable: Iterable<A>,
	secondIterable: Iterable<B>
): Generator<[ A, B ], void, undefined> {
	const secondIterator = secondIterable[Symbol.iterator]()

	for (const first of firstIterable) {
		const secondResult = secondIterator.next()

		if (secondResult.done)
			throw new Error(`Second iterable finished before first`)

		yield [ first, secondResult.value ]
	}

	const secondResult = secondIterator.next()

	if (!secondResult.done)
		throw new Error(`First iterable finished before second`)
}

export function* range(start: number, end: number): Generator<number, void, undefined> {
	for (; start < end; start++)
		yield start
}
