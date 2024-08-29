export async function* raceAllPromises<T>(promises: Promise<T>[]): AsyncGenerator<T, void, never> {
	const promisesIndex = promises.map(promise => {
		type SelfReferencingPromise = Promise<{ value: T, promise: SelfReferencingPromise }>

		const newPromise: SelfReferencingPromise = promise.then(value => ({ value, promise: newPromise }))

		return newPromise
	})

	while (promisesIndex.length) {
		const { value, promise } = await Promise.race(promisesIndex)

		yield value
		promisesIndex.splice(promisesIndex.indexOf(promise), 1)
	}
}
