export const createGeneratorLock = () => {
	const generator = (async function* () {
		let callback: (() => Promise<unknown>) | undefined

		while (true)
			// eslint-disable-next-line no-await-in-loop
			callback = yield await callback?.()
	}())

	generator.next()

	return generator
}
