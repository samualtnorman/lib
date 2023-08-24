export const objectHasOwn: (object: object, key: PropertyKey) => boolean =
	(Object as any).hasOwn || Function.prototype.call.bind(Object.prototype.hasOwnProperty)
