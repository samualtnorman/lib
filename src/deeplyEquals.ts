import isRecord from "./isRecord"
import objectHasOwn from "./objectHasOwn"

export const deeplyEquals = <T>(a: T, b: unknown): b is T => {
	if (Array.isArray(a)) {
		return (
			Array.isArray(b) &&
			a.length == b.length &&
			a.every((aElement, index) => deeplyEquals(aElement, b[index]))
		)
	}

	if (isRecord(a)) {
		const aEntries = Object.entries(a)

		return (
			!Array.isArray(b) &&
			isRecord(b) &&
			aEntries.length == Object.keys(b).length &&
			aEntries.every(([ key, aValue ]) => objectHasOwn(b, key) && deeplyEquals(aValue, b[key]))
		)
	}

	return a === b
}

export default deeplyEquals
