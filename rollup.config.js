import babel from "@rollup/plugin-babel"
import commonJS from "@rollup/plugin-commonjs"
import nodeResolve from "@rollup/plugin-node-resolve"
import { promises as fsPromises } from "fs"
import { terser } from "rollup-plugin-terser"
import packageConfig from "./package.json"

const { readdir: readDirectory } = fsPromises

/** @typedef {import("rollup").RollupOptions} RollupOptions */

const plugins = [
	babel({
		babelHelpers: "bundled",
		extensions: [ ".ts" ]
	}),
	commonJS(),
	nodeResolve({ extensions: [ ".ts" ] })
]

const sourceDirectory = "src"
const findFilesPromise = findFiles(sourceDirectory)

/** @type {(command: Record<string, unknown>) => Promise<RollupOptions>} */
export default async ({ w }) => {
	if (!w) {
		plugins.push(terser({
			ecma: 2019,
			keep_classnames: true,
			keep_fnames: true
		}))
	}

	return {
		input: Object.fromEntries(
			(await findFilesPromise)
				.filter(path => path.endsWith(".ts") && !path.endsWith(".d.ts"))
				.map(path => [ path.slice(sourceDirectory.length + 1, -3), path ])
		),
		output: {
			dir: "."
		},
		plugins,
		external: [
			..."dependencies" in packageConfig
				? Object.keys(packageConfig["dependencies"])
				: []
		]
	}
}

/**
 * @param path the directory to start recursively finding files in
 * @param filter either a blacklist or a filter function that returns false to ignore file name
 * @returns promise that resolves to array of found files
 * @type {(path: string, filter?: string[] | ((name: string) => boolean)) => Promise<string[]>}
 */
async function findFiles(path, filter = []) {
	const paths = []
	let /** @type {(name: string) => boolean} */ filterFunction

	if (Array.isArray(filter))
		filterFunction = name => !filter.includes(name)
	else
		filterFunction = filter

	for (const dirent of await readDirectory(path, { withFileTypes: true })) {
		if (!filterFunction(dirent.name))
			continue

		const direntPath = `${path}/${dirent.name}`

		if (dirent.isDirectory())
			await findFilesSub(direntPath, filterFunction, paths)
		else if (dirent.isFile())
			paths.push(direntPath)
	}

	return paths
}

async function findFilesSub(path, filterFunction, paths) {
	const promises = []

	for (const dirent of await readDirectory(path, { withFileTypes: true })) {
		if (!filterFunction(dirent.name))
			continue

		const direntPath = `${path}/${dirent.name}`

		if (dirent.isDirectory())
			promises.push(findFilesSub(direntPath, filterFunction, paths))
		else if (dirent.isFile())
			paths.push(direntPath)
	}

	await Promise.all(promises)
	return paths
}
