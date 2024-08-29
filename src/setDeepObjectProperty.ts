import { isRecord } from "./isRecord"

export function setDeepObjectProperty(
	object: Record<string | symbol, unknown>,
	keys: (string | symbol)[],
	value: unknown
): void {
	const lastKey = keys.pop()

	if (lastKey) {
		for (const key of keys)
			object = isRecord(object[key]) ? object[key] : object[key] = {}

		object[lastKey] = value
	}
}
