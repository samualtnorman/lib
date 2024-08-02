import type { LaxPartial } from "."
import { wait } from "./wait"

export type RetryOptions =
	{ attempts: number, retryDelay: number, onError: (error: unknown) => void, exponentialBackoff: boolean }

/** @example const response = await retry(() => fetch(url, fetchOptions)) */
export async function retry<T>(
	callback: () => Promise<T>,
	{
		attempts = 3,
		retryDelay = 1000,
		onError = error => console.error(`Caught`, error, `retrying ${attempts} more time(s) in ${retryDelay}ms`),
		exponentialBackoff = true
	}: LaxPartial<RetryOptions> = {}
) {
	while (true) {
		try {
			return await callback()
		} catch (error) {
			if (attempts <= 1)
				throw error

			attempts--

			if (exponentialBackoff)
				retryDelay *= 2

			onError(error)
			await wait(retryDelay)
		}
	}
}
