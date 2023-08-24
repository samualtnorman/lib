export async function* raceAllPromises<T>(promises: Promise<T>[]): AsyncGenerator<T, void, void> {
	const promisesIndex = promises.map(promise => {
		type SelfReferencingPromise = Promise<{ value: T, promise: SelfReferencingPromise }>

		const newPromise: SelfReferencingPromise = promise.then(value => ({ value, promise: newPromise }))

		return newPromise
	})

	while (promisesIndex.length) {
		// eslint-disable-next-line no-await-in-loop -- this is on purpose
		const { value, promise } = await Promise.race(promisesIndex)

		yield value
		promisesIndex.splice(promisesIndex.indexOf(promise), 1)
	}
}
