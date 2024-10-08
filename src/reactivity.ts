let currentEffect: (() => void) | undefined

export function createSignal<T>(value: T): [ () => T, (value: T) => void ] {
	const listeners = new Set<() => void>

	return [
		() => {
			if (currentEffect)
				listeners.add(currentEffect)

			return value
		},
		(newValue: T) => {
			if (currentEffect)
				throw Error(`Must not use signal setter inside an effect`)

			if (!Object.is(value, newValue)) {
				value = newValue

				for (const listener of [ ...listeners ])
					createEffect(listener)
			}
		}
	]
}

export function createEffect(effect: () => void): void {
	const outerEffect = currentEffect

	currentEffect = effect
	effect()
	currentEffect = outerEffect
}

export function createMemo<T>(getter: () => T): () => T {
	const listeners = new Set<() => void>
	let value: T
	let changed = true

	const effect = () => {
		changed = true

		for (const listener of [ ...listeners ])
			createEffect(listener)
	}

	return () => {
		if (currentEffect)
			listeners.add(currentEffect)

		if (changed) {
			const outerEffect = currentEffect

			changed = false
			currentEffect = effect
			value = getter()
			currentEffect = outerEffect
		}

		return value
	}
}
