export class DynamicMap<K, V> extends Map<K, V> {
	constructor(
		private readonly fallbackHandler: (key: K) => V
	) {
		super()
	}

	override get(key: K) {
		if (super.has(key))
			return super.get(key)!

		const value = this.fallbackHandler(key)

		super.set(key, value)

		return value
	}
}

export default DynamicMap

export class DynamicWeakMap<K extends object, V> extends WeakMap<K, V> {
	constructor(
		private readonly fallbackHandler: (key: K) => V
	) {
		super()
	}

	override get(key: K) {
		if (super.has(key))
			return super.get(key)!

		const value = this.fallbackHandler(key)

		super.set(key, value)

		return value
	}
}
