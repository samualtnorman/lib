import { isRecord, objectHasOwn } from "."

export function deeplyEquals(a: Record<string, unknown>, b: Record<string, unknown>) {
	const aEntries = Object.entries(a)

	if (aEntries.length != Object.keys(b).length)
		return false

	for (const [ key, aValue ] of aEntries) {
		if (!objectHasOwn(b, key))
			return false

		const bValue = b[key]

		if (isRecord(aValue)) {
			if (!isRecord(bValue) || !deeplyEquals(aValue, bValue))
				return false
		} else if (aValue !== bValue)
			return false
	}

	return true
}

export default deeplyEquals
