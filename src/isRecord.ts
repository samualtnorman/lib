export function isRecord(value: unknown): value is Record<string, unknown> {
	return !!value && typeof value == "object"
}

export default isRecord
