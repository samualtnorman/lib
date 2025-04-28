export const isRecord = (value: unknown): value is Record<PropertyKey, unknown> => Boolean(value) && typeof value == `object`
