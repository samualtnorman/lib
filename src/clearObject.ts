export function clearObject(object: Record<string | symbol, any>, prototype?: object | null): asserts object is Record<string | symbol, unknown> {
	for (const propertyName of Object.getOwnPropertyNames(object))
		delete object[propertyName]

	for (const propertySymbol of Object.getOwnPropertySymbols(object))
		delete object[propertySymbol]

	if (prototype !== undefined)
		Object.setPrototypeOf(object, prototype)
}

export default clearObject
