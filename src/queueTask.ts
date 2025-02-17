const { port1, port2 } = new MessageChannel
const tasks: (() => void)[] = []

port2.onmessage = () => {
	for (const task of tasks.splice(0))
		task()
}

export function queueTask(callback: () => void): void {
	if (!tasks.length)
		port1.postMessage(undefined)

	tasks.push(callback)
}
