import type { Rejecter, Resolver, Values } from "."

export class PromiseX<T> extends Promise<T> {
	static readonly State = { Pending: 0, Fulfilled: 1, Rejected: 2 } as const

	state: PromiseX.State = PromiseX.State.Pending
	value: T | undefined
	reason: unknown
	#resolve!: Resolver<T>
	#reject!: Rejecter

	constructor() {
		super((resolve, reject) => {
			this.#resolve = resolve
			this.#reject = reject
		})
	}

	resolve(value: T | PromiseLike<T>): void {
		(async () => {
			this.#resolve(value)
			this.value = await value
			this.state = PromiseX.State.Fulfilled
		})()
	}

	reject(reason?: unknown): void {
		this.#reject(reason)
		this.reason = reason
		this.state = PromiseX.State.Rejected
	}
}

declare namespace PromiseX {
	export type State = Values<typeof PromiseX.State>
}
