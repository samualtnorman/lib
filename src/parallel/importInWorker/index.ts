import { isMainThread } from "worker_threads"

// /** @example
//   * const { heavyFunction } = importInWorker<typeof import("./heavyFunction.js"), "heavyFunction">(
//   *     new URL("./heavyFunction.js", import.meta.url),
//   *     "heavyFunction"
//   * ) */
// export const importInWorker = (await (isMainThread ? import(`./fromMainThread`) : import(`./fromWorker`))).importInWorker

export {}
