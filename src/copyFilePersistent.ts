import fs, { PathLike } from "fs"
import { dirname as getPathDirectory } from "path"

const { mkdir: makeDirectory, copyFile } = fs.promises

export function copyFilePersistent(source: PathLike, destination: string, flags?: number) {
	return copyFile(source, destination, flags).catch(async (error: NodeJS.ErrnoException) => {
		if (error.code != `ENOENT`)
			throw error

		await makeDirectory(getPathDirectory(destination), { recursive: true })
		await copyFile(source, destination, flags)
	})
}

export default copyFilePersistent
