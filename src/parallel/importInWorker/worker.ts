import { parentPort } from "worker_threads"
import { ChildToMainMessageKind, type ChildToMainMessage, type MainToChildMessage } from "../shared"

parentPort!.on(`message`, async ({ args, functionName, id, path }: MainToChildMessage) => {
	try {
		parentPort!.postMessage(
			{
				kind: ChildToMainMessageKind.Return,
				id,
				value: await (await import(path))[functionName](...args)
			} satisfies ChildToMainMessage
		)
	} catch (error) {
		parentPort!
			.postMessage({ kind: ChildToMainMessageKind.Return, id, value: error as any } satisfies ChildToMainMessage)
	}
})
