import { PathLike, promises as fsPromises } from "fs"
import { dirname as pathDirectory } from "path"

const { mkdir: makeDirectory, copyFile } = fsPromises

export function copyFilePersistent(src: PathLike, dest: string, flags?: number) {
	return copyFile(src, dest, flags).catch(async (error: NodeJS.ErrnoException) => {
		if (error.code != "ENOENT")
			throw error

		await makeDirectory(pathDirectory(dest), { recursive: true })
		await copyFile(src, dest, flags)
	})
}

export default copyFilePersistent
