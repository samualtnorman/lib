export type SelfReferencingPromise<T> = Promise<{
	iteratorResult: IteratorResult<T, void>
	asyncGenerator: AsyncGenerator<T, void, void>
	promise: SelfReferencingPromise<T>
}>

/** For combining async generators but when you don't want them iterated through one at a time.
  * @param asyncGenerators Array of async generators
  * @returns A singular async generator that iterates through {@link asyncGenerators} in parallel */
export async function* combineAsyncGeneratorsParallel<T>(
	asyncGenerators: AsyncGenerator<T, void, void>[]
): AsyncGenerator<T, void, void> {
	const promises = asyncGenerators.map(asyncGenerator => {
		const promise: SelfReferencingPromise<T> =
			asyncGenerator.next().then(iteratorResult => ({ iteratorResult, asyncGenerator, promise }))

		return promise
	})

	while (asyncGenerators.length) {
		// eslint-disable-next-line no-await-in-loop -- this is on purpose
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

export default combineAsyncGeneratorsParallel
