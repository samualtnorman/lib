export function* iterateInParallel<A, B>(firstIterable: Iterable<A>, secondIterable: Iterable<B>): Generator<[ A, B ], void, void> {
	const firstIterator = firstIterable[Symbol.iterator]()
	const secondIterator = secondIterable[Symbol.iterator]()

	while (true) {
		const firstIteratorResult = firstIterator.next()
		const secondIteratorResult = secondIterator.next()

		if (firstIteratorResult.done) {
			if (secondIteratorResult.done)
				return

			throw new Error(`first iterator finished before second`)
		}

		if (secondIteratorResult.done)
			throw new Error(`second iterator finished before first`)

		yield [ firstIteratorResult.value, secondIteratorResult.value ]
	}
}

export default iterateInParallel
