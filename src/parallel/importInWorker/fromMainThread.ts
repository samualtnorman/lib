import os from "os"
import { MessageChannel, Worker, type MessagePort } from "worker_threads"
import type { AnyFunction, Async, Entries, Rejecter, Resolver } from "../.."
import { ChildToMainMessageKind, type ChildToMainMessage, type MainToChildMessage, MainToChildMessageKind } from "../shared"

const cpus = os.cpus()
const messagePorts = cpus.map(() => Array<MessagePort>(12))
const WorkerModuleURL = new URL(`fromWorker.js`, import.meta.url)
const idsToPromiseCallbacks = new Map<number, { resolve: Resolver<any>, reject: Rejecter }>
const modulesTaskersAlreadyImported = new Set<string>
let idCounter = 0

for (let index = cpus.length - 1; index--;) {
	for (let subIndex = index + 1; subIndex < cpus.length; subIndex++) {
		const { port1, port2 } = new MessageChannel

		messagePorts[index]![subIndex - 1] = port1
		messagePorts[subIndex]![index] = port2
	}
}

const taskers = cpus.map((_, index) => {
	const tasker = { worker: new Worker(WorkerModuleURL, { workerData: messagePorts[index] }), tasks: 0 }

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

export function importInWorker<
	TModule extends object,
	TName extends Extract<Entries<TModule>, [string, AnyFunction]>[0]
>(url: URL, name: TName) {
	if (!modulesTaskersAlreadyImported.has(url.href)) {
		modulesTaskersAlreadyImported.add(url.href)

		for (const tasker of taskers) {
			tasker.worker.postMessage(
				{ kind: MainToChildMessageKind.Import, path: url.href } satisfies MainToChildMessage
			)
		}
	}

	return {
		[name](...args: any) {
			const tasker = taskers.reduce((previous, current) => previous.tasks > current.tasks ? current : previous)
			const id = idCounter++

			tasker.tasks++

			tasker.worker.postMessage(
				{ kind: MainToChildMessageKind.Call, id, path: url.href, name, args } satisfies MainToChildMessage
			)

			return new Promise((resolve, reject) => idsToPromiseCallbacks.set(id, { resolve, reject }))
		}
	} as { [K in TName]: Async<TModule[TName] extends AnyFunction ? TModule[TName] : never> }
}
