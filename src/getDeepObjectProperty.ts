export function getDeepObjectProperty(object: any, keys: (string | symbol)[]) {
	for (const key of keys) {
		if (object == undefined)
			return object

		object = object[key]
	}

	return object
}

export default getDeepObjectProperty
