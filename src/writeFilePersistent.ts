import { mkdir as makeDirectory, writeFile } from "fs/promises"
import { dirname as getPathDirectory } from "path"
import { RemoveFirst } from "."

export function writeFilePersistent(
	path: string,
	...restOfWriteFileArguments: RemoveFirst<Parameters<typeof writeFile>>
) {
	return writeFile(path, ...restOfWriteFileArguments).catch(async (error: NodeJS.ErrnoException) => {
		if (error.code != `ENOENT`)
			throw error

		await makeDirectory(getPathDirectory(path), { recursive: true })
		await writeFile(path, ...restOfWriteFileArguments)
	})
}

export default writeFilePersistent
