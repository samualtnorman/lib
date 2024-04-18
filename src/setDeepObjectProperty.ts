import { isRecord } from "./isRecord"

export function setDeepObjectProperty(
	object: Record<string | symbol, unknown>,
	keys: (string | symbol)[],
	value: unknown
) {
	const lastKey = keys.pop()

	if (!lastKey)
		return object

	for (const key of keys) {
		const child = object[key]

		object = isRecord(child) ? child : object[key] = {}
	}

	object[lastKey] = value
}
