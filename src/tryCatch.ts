export function tryCatch<T>(callback: () => T): T | undefined
export function tryCatch<T>(callback: () => T, fallback: (error: unknown) => T): T
export function tryCatch<T>(callback: () => T, fallback?: (error: unknown) => T) {
	try {
		return callback()
	} catch (error) {
		return fallback?.(error)
	}
}
