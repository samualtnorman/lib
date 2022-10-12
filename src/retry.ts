import { LaxPartial } from "."
import wait from "./wait"

export type RetryOptions = { attempts: number, retryDelay: number, onError: (error: unknown) => void }

export function retry<T>(
	function_: () => Promise<T>,
	{ attempts = 3, retryDelay = 1000, onError }: LaxPartial<RetryOptions> = {}
): Promise<T> {
	return function_().catch(async (error: unknown) => {
		if (attempts <= 1)
			throw error

		onError?.(error)
		await wait(retryDelay)

		return retry(function_, { attempts: attempts - 1, retryDelay, onError })
	})
}

export default retry
