export function* mapIterable<T, R>(iterable: Iterable<T>, callback: (item: T) => R): Generator<R, void, never> {
	for (const item of iterable)
		yield callback(item)
}

export function* filterIterable<T>(iterable: Iterable<T>, callback: (item: T) => boolean): Generator<T, void, never> {
	for (const item of iterable) {
		if (callback(item))
			yield item
	}
}

export function* toGenerator<T>(iterable: Iterable<T>): Generator<T, void, never> {
	for (const item of iterable)
		yield item
}

export function* iterateInParallel<A, B>(
	firstIterable: Iterable<A>,
	secondIterable: Iterable<B>
): Generator<[ A, B ], void, never> {
	const secondIterator = secondIterable[Symbol.iterator]()

	for (const first of firstIterable) {
		const secondResult = secondIterator.next()

		if (secondResult.done)
			throw Error(`Second iterable finished before first`)

		yield [ first, secondResult.value ]
	}

	const secondResult = secondIterator.next()

	if (!secondResult.done)
		throw Error(`First iterable finished before second`)
}

export async function asyncIterableToArray<T>(asyncIterable: AsyncIterable<T>): Promise<T[]> {
	const array = []

	for await (const item of asyncIterable)
		array.push(item)

	return array
}

type SelfReferencingPromise<T> = Promise<{
	iteratorResult: IteratorResult<T, void>
	asyncGenerator: AsyncIterator<T, void, never>
	promise: SelfReferencingPromise<T>
}>

/** For merging async iterators concurrently.
  * @param asyncIterators Array of async iterators
  * @returns An async generator that iterates through {@link asyncIterators} concurrently */
export async function* mergeAsyncIterators<T>(
	asyncIterators: AsyncIterator<T, void, never>[]
): AsyncGenerator<T, void, never> {
	const promises = asyncIterators.map(asyncGenerator => {
		const promise: SelfReferencingPromise<T> =
			asyncGenerator.next().then(iteratorResult => ({ iteratorResult, asyncGenerator, promise }))

		return promise
	})

	while (asyncIterators.length) {
		const { iteratorResult, asyncGenerator, promise } = await Promise.race(promises)

		if (iteratorResult.done) {
			promises.splice(promises.indexOf(promise), 1)

			continue
		}

		yield iteratorResult.value

		const newPromise: SelfReferencingPromise<T> =
			asyncGenerator.next().then(iteratorResult => ({ iteratorResult, asyncGenerator, promise: newPromise }))

		promises[promises.indexOf(promise)] = newPromise
	}
}
