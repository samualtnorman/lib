export function shuffle<T>(array: T[]): T[] {
	for (let i = array.length; i;)
		array.push(array.splice(Math.floor(Math.random() * i--), 1)[0])

	return array
}

export default shuffle
