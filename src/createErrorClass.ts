export function createErrorClass(name: `${string}Error`) {
	const class_ = { [name]: class extends Error {} }[name]!

	class_.prototype.name = name

	return class_
}

export default createErrorClass
