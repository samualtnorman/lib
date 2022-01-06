export const objectHasOwn: (object: object, key: PropertyKey) => boolean = Function.prototype.call.bind(Object.prototype.hasOwnProperty)
export default objectHasOwn
