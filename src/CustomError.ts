export class CustomError extends Error {
	override name = this.constructor.name
}

export default CustomError
