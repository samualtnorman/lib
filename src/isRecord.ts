export const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value == `object`
export default isRecord
