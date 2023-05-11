import { ChildToMainMessageKind, type ChildToMainMessage, type MainToChildMessage } from "../shared"

process.addListener(`message`, (async ({ args, name, id, path }: MainToChildMessage) => {
	try {
		process.send!({
			kind: ChildToMainMessageKind.Return,
			id,
			value: await (await import(path))[name](...args)
		} satisfies ChildToMainMessage)
	} catch (error) {
		process.send!({ kind: ChildToMainMessageKind.Throw, id, value: error as any } satisfies ChildToMainMessage)
	}
}) as NodeJS.MessageListener)
