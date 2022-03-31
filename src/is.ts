/**
 * like `instanceof` but shallow
 *
 * @returns whether `object` is a direct instance of the constructor
 */
export function is<C extends { prototype: any }>(object: any, constructor: C): object is C["prototype"] {
	return object != undefined && Object.getPrototypeOf(object) == constructor.prototype
}

export default is
