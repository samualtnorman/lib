export function is<C extends Function>(object: {}, constructor: C): object is C["prototype"] {
	return Object.getPrototypeOf(object) == constructor.prototype
}

export default is
