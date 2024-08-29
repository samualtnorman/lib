/** @example
  * const lock = createLock()
  *
  * const lockingFunction = () => lock(async () => {
  *     // ...
  * }) */
export function createLock(): <T>(callback: () => Promise<T>) => Promise<T> {
	let promise = Promise.resolve()

	return async callback => {
		const oldPromise = promise
		let unlock!: () => void

		promise = new Promise(resolve => unlock = resolve)
		await oldPromise

		return callback().finally(unlock)
	}
}
