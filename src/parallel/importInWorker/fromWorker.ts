import { cpus } from "os"
import { Worker } from "worker_threads"
import type { AnyFunction, Async, Entries, Rejecter, Resolver } from "../.."
import { parentPort, workerData, type MessagePort } from "worker_threads"
import { ChildToMainMessageKind, type ChildToMainMessage, type MainToChildMessage, MainToChildMessageKind } from "../shared"

const idsToPromiseCallbacks = new Map<number, { resolve: Resolver<any>, reject: Rejecter }>
const modulesTaskersAlreadyImported = new Set<string>
const ports: MessagePort[] = workerData
let idCounter = 0

addMessageHandler(parentPort!)

for (const port of ports)
	addMessageHandler(port)

/** @example
  * const { heavyFunction } = importInWorker<typeof import("./heavyFunction.js"), "heavyFunction">(
  *     new URL("./heavyFunction.js", import.meta.url),
  *     "heavyFunction"
  * ) */
export function importInWorker<
	TModule extends object,
	TName extends Extract<Entries<TModule>, [string, AnyFunction]>[0]
>(url: URL, name: TName) {
	if (!modulesTaskersAlreadyImported.has(url.href)) {
		modulesTaskersAlreadyImported.add(url.href)

		for (const port of ports) {
			if (port) {
				port.postMessage(
					{ kind: MainToChildMessageKind.Import, path: url.href } satisfies MainToChildMessage
				)
			}
		}
	}

	return {
		[name](...args: any) {
			const port = ports.map(port => new Promise(resolve => {
				port.postMessage(

				)
			}))

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

function addMessageHandler(port: MessagePort) {
	port.on(`message`, async (message: MainToChildMessage) => {
		if (message.kind == MainToChildMessageKind.Import) {
			import(message.path)

			return
		}

		try {
			port.postMessage({
				kind: ChildToMainMessageKind.Return,
				id: message.id,
				value: await (await import(message.path))[message.name](...message.args)
			} satisfies ChildToMainMessage)
		} catch (error) {
			port.postMessage(
				{ kind: ChildToMainMessageKind.Throw, id: message.id, value: error as any } satisfies ChildToMainMessage
			)
		}
	})
}
