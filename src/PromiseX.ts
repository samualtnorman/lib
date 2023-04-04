import type { Rejecter, Resolver, Values } from "."

export class PromiseX<T> extends Promise<T> {
	static readonly State = {
		Pending: 0,
		Fulfilled: 1,
		Rejected: 2
	} as const

	readonly resolve: Resolver<T>
	readonly reject: Rejecter
	state: PromiseX.State = PromiseX.State.Pending
	value: T | undefined
	reason: unknown

	constructor(executor?: (resolve: Resolver<T>, reject: Rejecter) => void) {
		let resolve!: Resolver<T>
		let reject!: Rejecter

		super((resolve_, reject_) => {
			resolve = async value => {
				this.state = PromiseX.State.Fulfilled
				this.value = await value
				resolve_(value)
			}

			reject = reason => {
				this.state = PromiseX.State.Rejected
				this.reason = reason
				reject_(reason)
			}
		})

		this.resolve = resolve
		this.reject = reject
		executor?.(resolve, reject)
	}
}

declare namespace PromiseX {
	export type State = Values<typeof PromiseX.State>
}
