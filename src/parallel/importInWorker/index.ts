import { cpus } from "os"
import { Worker } from "worker_threads"
import { ChildToMainMessage, ChildToMainMessageKind, Cloneable, MainToChildMessage } from "../shared"

const WorkerModulePath = new URL(`worker.js`, import.meta.url)
const idsToPromiseCallbacks = new Map<number, { resolve: (value: any) => void, reject: (reason: any) => void }>

const taskers = cpus().map(() => {
	const tasker = { worker: new Worker(WorkerModulePath), tasks: 0 }

	tasker.worker.on(`message`, ({ kind, id, value }: ChildToMainMessage) => {
		const { resolve, reject } = idsToPromiseCallbacks.get(id)!

		tasker.tasks--

		if (kind == ChildToMainMessageKind.Return)
			resolve(value)
		else
			reject(value)
	})

	return tasker
})

let idCounter = 0

export const importInWorker = <T extends (...args: any) => Cloneable>(
	url: URL,
	functionName = `default`
) => ({
	[functionName](...args: Parameters<T>) {
		const tasker = taskers.reduce((previous, current) => previous.tasks > current.tasks ? current : previous)
		const id = idCounter++

		tasker.tasks++
		tasker.worker.postMessage({ id, path: url.href, functionName, args } satisfies MainToChildMessage)

		return new Promise<ReturnType<T>>((resolve, reject) => idsToPromiseCallbacks.set(id, { resolve, reject }))
	}
})[functionName]!

export default importInWorker
