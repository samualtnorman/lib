import { fork } from "child_process"
import { cpus } from "os"
import { fileURLToPath } from "url"
import { ChildToMainMessage, ChildToMainMessageKind, Cloneable, MainToChildMessage } from "../shared"

const ProcessModulePath = fileURLToPath(new URL(`process.js`, import.meta.url))
const idsToPromiseCallbacks = new Map<number, { resolve: (value: any) => void, reject: (reason: any) => void }>

const taskers = cpus().map(() => {
	const tasker = { process: fork(ProcessModulePath, { serialization: `advanced` }), tasks: 0 }

	tasker.process.on(`message`, ({ kind, id, value }: ChildToMainMessage) => {
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

export const importInProcess = <T extends (...args: any) => Cloneable>(
	url: URL,
	functionName = `default`
) => ({
	[functionName](...args: Parameters<T>) {
		const tasker = taskers.reduce((previous, current) => previous.tasks > current.tasks ? current : previous)
		const id = idCounter++

		tasker.tasks++
		tasker.process.send({ id, path: url.href, functionName, args } satisfies MainToChildMessage)

		return new Promise<ReturnType<T>>((resolve, reject) => idsToPromiseCallbacks.set(id, { resolve, reject }))
	}
})[functionName]!

export default importInProcess
