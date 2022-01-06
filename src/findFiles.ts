import fs from "fs"

const { readdir: readDirectory } = fs.promises

/**
 * @param path the directory to start recursively finding files in
 * @param filter either a blacklist or a filter function that returns false to ignore file name
 * @returns promise that resolves to array of found files
 */
export async function findFiles(path: string, filter: string[] | ((name: string) => boolean) = [], paths: string[] = []) {
	const filterFunction = Array.isArray(filter)
		? (name: string) => !filter.includes(name)
		: filter

	await Promise.all((await readDirectory(path, { withFileTypes: true })).map(async dirent => {
		if (!filterFunction(dirent.name))
			return

		const direntPath = `${path}/${dirent.name}`

		if (dirent.isDirectory())
			await findFiles(direntPath, filterFunction, paths)
		else if (dirent.isFile())
			paths.push(direntPath)
	}))

	return paths
}

export default findFiles
