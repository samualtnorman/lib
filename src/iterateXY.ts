export function* iterateXY(x = 0, y = 0): Generator<{ x: number, y: number }, never, never> {
	while (true) {
		yield { x, y }

		if (!x) {
			x = y + 1
			y = 0
		} else if (x > y)
			y++
		else
			x--
	}
}
