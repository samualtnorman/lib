export function shuffle<T>(array: T[]): T[] {
	for (let index = array.length; index;)
		array.push(array.splice(Math.floor(Math.random() * index--), 1)[0])

	return array
}

export default shuffle
