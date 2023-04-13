import type { Cloneable } from ".."

export const MainToChildMessageKind = { Import: 0, Call: 1 } as const
export type MainToChildMessageKind = typeof MainToChildMessageKind[keyof typeof MainToChildMessageKind]

export type MainToChildMessage =
	{ kind: typeof MainToChildMessageKind.Import, path: string } |
	{ kind: typeof MainToChildMessageKind.Call, id: number, path: string, name: string, args: Cloneable[] }

// TODO Can be exanded to `yield` in the future
export const ChildToMainMessageKind = { Return: 0, Throw: 1 } as const
export type ChildToMainMessageKind = typeof ChildToMainMessageKind[keyof typeof ChildToMainMessageKind]
export type ChildToMainMessage = { kind: ChildToMainMessageKind, id: number, value: Cloneable }
