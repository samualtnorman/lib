import { promises as fsPromises } from "fs"
import { dirname as getPathDirectory } from "path"

const { writeFile, mkdir: makeDirectory } = fsPromises

export function writeFilePersistent(
	path: string,
	data: any,
	options?: { encoding?: string | null | undefined, mode?: string | number | undefined, flag?: string | number | undefined } | string | null
) {
	return writeFile(path, data, options).catch(async (error: NodeJS.ErrnoException) => {
		if (error.code != "ENOENT")
			throw error

		await makeDirectory(getPathDirectory(path), { recursive: true })
		await writeFile(path, data, options)
	})
}

export default writeFilePersistent
