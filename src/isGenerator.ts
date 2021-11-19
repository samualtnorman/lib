const generatorPrototype = Object.getPrototypeOf((function* () {})())

export function isGenerator(value: unknown): value is Generator {
	return Boolean(value) && Object.getPrototypeOf(value) == generatorPrototype
}

export default isGenerator
