import { cpus } from "os"
import { Worker } from "worker_threads"
import { ChildToMainMessageKind, type ChildToMainMessage, type MainToChildMessage } from "../shared"
import type { AnyFunction, Async, Entries, Rejecter, Resolver } from "../.."

const WorkerModuleURL = new URL(`worker.js`, import.meta.url)
const idsToPromiseCallbacks = new Map<number, { resolve: Resolver<any>, reject: Rejecter }>
let idCounter = 0

const taskers = cpus().map(() => {
	const tasker = { worker: new Worker(WorkerModuleURL), tasks: 0 }

	tasker.worker.on(`message`, ({ kind, id, value }: ChildToMainMessage) => {
		const { resolve, reject } = idsToPromiseCallbacks.get(id)!

		idsToPromiseCallbacks.delete(id)
		tasker.tasks--

		if (kind == ChildToMainMessageKind.Return)
			resolve(value)
		else
			reject(value)
	})

	return tasker
})

/** @example
  * const { heavyFunction } = importInWorker<typeof import("./heavyFunction.js"), "heavyFunction">(
  *     new URL("./heavyFunction.js", import.meta.url),
  *     "heavyFunction"
  * ) */
export const importInWorker = <
	TModule extends object,
	TName extends Extract<Entries<TModule>, [ string, AnyFunction ]>[0]
>(url: URL, name: TName) => ({
	[name](...args: any) {
		const tasker = taskers.reduce((previous, current) => previous.tasks > current.tasks ? current : previous)
		const id = idCounter++

		tasker.tasks++
		tasker.worker.postMessage({ id, path: url.href, name, args } satisfies MainToChildMessage)

		return new Promise((resolve, reject) => idsToPromiseCallbacks.set(id, { resolve, reject }))
	}
}) as { [K in TName]: Async<TModule[TName] extends AnyFunction ? TModule[TName] : never> }
