export type SelfReferencingPromise<T> = Promise<{ iteratorResult: IteratorResult<T, void>, asyncGenerator: AsyncGenerator<T, void, void>, promise: SelfReferencingPromise<T> }>

/**
 * for combining async generators but when you don't just want them iterated through one at a time
 * @param asyncGenerators array of async generators
 * @returns a singular async generator that iterates through {@link asyncGenerators} in parallel
 */
export async function* combineAsyncGeneratorsParallel<T>(asyncGenerators: AsyncGenerator<T, void, void>[]): AsyncGenerator<T, void, void> {
	const promises = asyncGenerators.map(asyncGenerator => {
		const promise: SelfReferencingPromise<T> = asyncGenerator.next().then(iteratorResult => ({ iteratorResult, asyncGenerator, promise }))
		return promise
	})

	while (asyncGenerators.length) {
		const { iteratorResult, asyncGenerator, promise } = await Promise.race(promises)

		// type checking fails without ` == true`
		if (iteratorResult.done == true) {
			promises.splice(promises.indexOf(promise), 1)
			continue
		}

		yield iteratorResult.value

		const newPromise: SelfReferencingPromise<T> = promises[promises.indexOf(promise)] = asyncGenerator.next().then(iteratorResult => ({ iteratorResult, asyncGenerator, promise: newPromise }))
	}
}

export default combineAsyncGeneratorsParallel
