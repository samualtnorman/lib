export function createLock() {
	let promise = Promise.resolve()

	return async <T>(callback: () => Promise<T>): Promise<T> => {
		const oldPromise = promise
		let unlock!: () => void

		promise = new Promise(resolve => unlock = resolve)
		await oldPromise

		return callback().finally(unlock)
	}
}

export default createLock