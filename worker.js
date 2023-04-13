import { parentPort, workerData, threadId, MessagePort } from "worker_threads"

// console.log(`Main Thread -> Worker ${threadId}:`, workerData)

const messagePort = /** @type {MessagePort} */ (workerData)

messagePort.on("message", (value) => console.log(`Worker ${threadId}: From message port:`, value))
messagePort.postMessage(new Map([ [ "foo", "bar" ] ]))

queueMicrotask(callback)

// parentPort.on("message", async () => {
// 	parentPort.postMessage(value)
// })
