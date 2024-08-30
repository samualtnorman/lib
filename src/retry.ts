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
): Promise<T> {
	if (attempts < 1)
		throw Error(`Retry attempts must be higher than 0`)

	while (--attempts) {
		try {
			return await callback()
		} catch (error) {
			onError(error)
		}

		await wait(retryDelay)

		if (exponentialBackoff)
			retryDelay *= 2
	}

	return callback()
}
