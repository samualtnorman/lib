export function createErrorClass(name: `${string}Error`) {
	const class_ = { [name]: class extends Error {} }[name]!

	Object.defineProperty(class_.prototype, `name`, { value: name })

	return class_
}
