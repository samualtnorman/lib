import { PathLike, promises as fsPromises } from "fs"
import { dirname as pathDirectory } from "path"

const { mkdir: makeDirectory, copyFile } = fsPromises

export function copyFilePersistent(source: PathLike, destination: string, flags?: number) {
	return copyFile(source, destination, flags).catch(async (error: NodeJS.ErrnoException) => {
		if (error.code != `ENOENT`)
			throw error

		await makeDirectory(pathDirectory(destination), { recursive: true })
		await copyFile(source, destination, flags)
	})
}

export default copyFilePersistent
