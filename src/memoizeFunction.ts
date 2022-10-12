const defaultArgumentComparerFunction = (a: unknown[], b: unknown[]) =>
	a.length == b.length && a.every((aItem, index) => aItem == b[index])

export function memoizeFunction<A extends unknown[], R>(
	function_: (...arguments_: A) => R,
	argumentComparerFunction: (a: unknown[], b: unknown[]) => boolean = defaultArgumentComparerFunction
) {
	const memos: { arguments: A, returnValue: R }[] = []

	return (...arguments_: A): R => {
		const foundMemo = memos.find(memo => argumentComparerFunction(memo.arguments, arguments_))

		if (foundMemo)
			return foundMemo.returnValue

		const newMemo = { arguments: arguments_, returnValue: function_(...arguments_) }

		memos.push(newMemo)

		return newMemo.returnValue
	}
}

export default memoizeFunction
