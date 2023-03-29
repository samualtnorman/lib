export class SortedList<T> {
	public readonly array: readonly T[]

	constructor(private readonly comparer: (a: T, b: T) => number, items?: Iterable<T>) {
		this.array = items ? [ ...items ].sort(comparer) : []
	}

	add(item: T) {
		const index = this.array.findIndex(arrayItem => this.comparer(arrayItem, item) >= 0)

		if (index == -1)
			(this.array as T[]).push(item)
		else
			(this.array as T[]).splice(index, 0, item)
	}
}
