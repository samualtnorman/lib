/* eslint-disable no-await-in-loop */
import type { LaxPartial } from "/"
import { wait } from "/wait"

export type RetryOptions = { attempts: number, retryDelay: number, onError: (error: unknown) => void }

/** @example const response = await retry(() => fetch(url, fetchOptions)) */
export async function retry<T>(
	callback: () => Promise<T>,
	{
		attempts = 3,
		retryDelay = 1000,
		onError = error => console.error(`Caught`, error, `retrying`, attempts, `more time(s)`)
	}: LaxPartial<RetryOptions> = {}
) {
	while (true) {
		try {
			return await callback()
		} catch (error) {
			if (attempts <= 1)
				throw error

			attempts--
			onError(error)
			await wait(retryDelay)
		}
	}
}

export default retry
