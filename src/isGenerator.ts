// eslint-disable-next-line @typescript-eslint/no-empty-function -- dummy generator function
const generatorPrototype = Object.getPrototypeOf((function* () {})())

export const isGenerator = (value: unknown): value is Generator =>
	Boolean(value) && Object.getPrototypeOf(value) == generatorPrototype
