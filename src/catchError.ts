export function catchError<T>(callback: () => T): [ T, undefined ] | [ undefined, Error ] {
	try {
		return [ callback(), undefined ]
	} catch (error) {
		if (error instanceof Error)
			return [ undefined, error ]
		
		throw error
	}
}