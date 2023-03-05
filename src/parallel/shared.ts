import type { Cloneable } from "/"

export type MainToChildMessage = { id: number, path: string, name: string, args: Cloneable[] }

export const ChildToMainMessageKind = {
	Return: 0,
	Throw: 1
	// TODO Can be exanded to `yield` in the future
} as const

export type ChildToMainMessageKind = typeof ChildToMainMessageKind[keyof typeof ChildToMainMessageKind]
export type ChildToMainMessage = { kind: ChildToMainMessageKind, id: number, value: Cloneable }
