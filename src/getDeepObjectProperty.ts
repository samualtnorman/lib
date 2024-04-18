import { isRecord } from "./isRecord"

export function getDeepObjectProperty(object: Record<string | symbol, unknown>, keys: (string | symbol)[]) {
	const lastKey = keys.pop()

	if (!lastKey)
		return object

	for (const key of keys) {
		const child = object[key]

		if (!isRecord(child))
			throw Error(`Expected object, got ${typeof child}`)

		object = child
	}

	return object[lastKey]
}
