export function clearObject(object: {}, prototype = Object.prototype) {
	for (const propertyName of Object.getOwnPropertyNames(object))
		delete (object as any)[propertyName]

	for (const propertySymbol of Object.getOwnPropertySymbols(object))
		delete (object as any)[propertySymbol]

	Object.setPrototypeOf(object, prototype)

	return object
}

export default clearObject
