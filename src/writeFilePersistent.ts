import { mkdir as makeDirectory, writeFile } from "fs/promises"
import { dirname as getPathDirectory } from "path"
import type { Slice1 } from "."

export const writeFilePersistent = (
	path: string,
	...restOfWriteFileArguments: Slice1<Parameters<typeof writeFile>>
) => writeFile(path, ...restOfWriteFileArguments).catch(async (error: NodeJS.ErrnoException) => {
	if (error.code != `ENOENT`)
		throw error

	await makeDirectory(getPathDirectory(path), { recursive: true })
	await writeFile(path, ...restOfWriteFileArguments)
})

export default writeFilePersistent
