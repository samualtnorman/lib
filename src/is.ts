/** Like `instanceof` but shallow.
  * @returns whether `object` is a direct instance of the constructor */
export const is = <C extends { prototype: any }>(object: any, constructor: C): object is C["prototype"] =>
	object != undefined && Object.getPrototypeOf(object) == constructor.prototype

export default is
