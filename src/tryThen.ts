export function tryThen<const TCallbackReturn>(
	callback: () => TCallbackReturn,
	then: (value: TCallbackReturn) => void
): void {
	let value
	let noError = true

	try {
		value = callback()
	} catch {
		noError = false
	}

	if (noError)
		then(value!)
}
