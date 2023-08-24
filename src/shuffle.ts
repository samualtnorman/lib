export function shuffle<T>(array: T[]): T[] {
	let index = array.length

	while (index) {
		const randomIndex = Math.floor(Math.random() * index)
		const randomItem = array[randomIndex]!

		index--
		array[randomIndex] = array[index]!
		array[index] = randomItem
	}

	return array
}
