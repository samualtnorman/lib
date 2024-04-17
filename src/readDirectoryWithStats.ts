import { stat as getFileStats, readdir as readDirectory } from "fs/promises"
import { resolve as resolvePath } from "path"

export const readDirectoryWithStats = async (path: string) =>
	Promise.all((await readDirectory(path)).map(async name => {
		const resolvedPath = resolvePath(path, name)

		return ({ path: resolvedPath, name, stats: await getFileStats(resolvedPath) })
	}))
