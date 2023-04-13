/* eslint-disable @typescript-eslint/consistent-type-imports */
// import { importInWorker } from "./parallel/importInWorker"

// const { fibonacci: fibonacciAsync } = importInWorker<typeof import("./fibonacci.js"), "fibonacci">(new URL(`fibonacci.js`, import.meta.url), `fibonacci`)

// export async function fibonacci(number: number): Promise<number> {
// 	if (number < 2)
// 		return number

// 	const [ left, right ] = await Promise.all([ fibonacciAsync(number - 1), fibonacciAsync(number - 2) ])

// 	return left + right
// }

export {}
