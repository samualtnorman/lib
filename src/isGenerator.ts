const generatorPrototype = Object.getPrototypeOf((function* () {})())

export const isGenerator = (value: unknown): value is Generator =>
	Boolean(value) && Object.getPrototypeOf(value) == generatorPrototype
