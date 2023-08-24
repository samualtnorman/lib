export function tryCatch<CallbackReturn, CatchReturn>(callback: () => CallbackReturn, catchCallback: (error: unknown) => CatchReturn): CallbackReturn | CatchReturn
export function tryCatch<CallbackReturn, ThenReturn, CatchReturn>(callback: () => CallbackReturn, thenCallback: (callbackReturn: CallbackReturn) => ThenReturn, catchCallback: (error: unknown) => CatchReturn): ThenReturn | CatchReturn
export function tryCatch<CallbackReturn, ThenReturn, CatchReturn>(callback: () => CallbackReturn, thenOrCatchCallback: ((callbackReturn: CallbackReturn) => ThenReturn) & ((error: unknown) => CatchReturn), catchCallback?: (error: unknown) => CatchReturn) {
	let callbackReturn

	try {
		callbackReturn = callback()
	} catch (error) {
		return (catchCallback || thenOrCatchCallback)(error)
	}

	if (catchCallback)
		return thenOrCatchCallback(callbackReturn)

	return callbackReturn
}
