#!/usr/bin/env node
// import { fibonacci } from "./dist/fibonacci.js"

// console.time()
// console.log(await fibonacci(44))
// console.timeEnd()
// process.exit()

///

// import { Worker } from "worker_threads"

// const { port1, port2 } = new MessageChannel()

// const worker1 = new Worker(new URL("worker.js", import.meta.url), { workerData: port1, transferList: [ port1 ] })
// const worker2 = new Worker(new URL("worker.js", import.meta.url), { workerData: port2, transferList: [ port2 ] })

// worker1.on("message", (value) => console.log("Worker 1 -> Main Thread:", value))
// worker2.on("message", (value) => console.log("Worker 2 -> Main Thread:", value))
