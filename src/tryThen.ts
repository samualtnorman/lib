export function tryThen<const TCallbackReturn>(
	callback: () => TCallbackReturn,
	then: (value: TCallbackReturn) => void
): void {
	let value

	try {
		value = callback()
	} catch {
		return
	}

	then(value!)
}
