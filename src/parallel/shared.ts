export type Cloneable = undefined | null | boolean | number | string | Cloneable[] | { [key: string]: Cloneable } |
	ArrayBuffer | DataView | Date | Error | Map<Cloneable, Cloneable> | RegExp | Set<Cloneable> | Uint8ClampedArray |
	Uint8Array | Uint16Array | Uint32Array | BigUint64Array | Int8Array | Int16Array | Int32Array | BigInt64Array |
	Float32Array | Float64Array

export type MainToChildMessage = { id: number, path: string, functionName: string, args: Cloneable[] }

export const ChildToMainMessageKind = {
	Return: 0,
	Throw: 1
	// Can be exanded to `yield` in the future
} as const

export declare namespace ChildToMainMessageKind {
	export type Return = 0
	export type Throw = 1
}

export type ChildToMainMessageKind = typeof ChildToMainMessageKind[keyof typeof ChildToMainMessageKind]
export type ChildToMainMessage = { kind: ChildToMainMessageKind, id: number, value: Cloneable }
