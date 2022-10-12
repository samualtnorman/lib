import { PathLike } from "fs"
import { copyFile, mkdir as makeDirectory } from "fs/promises"
import { dirname as getPathDirectory } from "path"

export function copyFilePersistent(source: PathLike, destination: string, flags?: number) {
	return copyFile(source, destination, flags).catch(async (error: NodeJS.ErrnoException) => {
		if (error.code != `ENOENT`)
			throw error

		await makeDirectory(getPathDirectory(destination), { recursive: true })

		return copyFile(source, destination, flags)
	})
}

export default copyFilePersistent
