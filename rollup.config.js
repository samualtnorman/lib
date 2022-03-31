import babel from "@rollup/plugin-babel"
import commonJS from "@rollup/plugin-commonjs"
import nodeResolve from "@rollup/plugin-node-resolve"
import fs from "fs"
import { terser } from "rollup-plugin-terser"
import packageConfig_ from "./package.json"

const { readdir: readDirectory } = fs.promises

/** @typedef {import("rollup").RollupOptions} RollupOptions */

const /** @type {Record<string, any>} */ packageConfig = packageConfig_

const plugins = [
	babel({
		babelHelpers: `bundled`,
		extensions: [ `.ts` ]
	}),
	commonJS(),
	nodeResolve({ extensions: [ `.ts` ] })
]

const sourceDirectory = `src`

const findFilesPromise = findFiles(sourceDirectory)
const external = []

if (`dependencies` in packageConfig)
	external.push(...Object.keys(packageConfig.dependencies))

/** @type {(command: Record<string, unknown>) => Promise<RollupOptions>} */
export default async ({ w }) => {
	if (!w) {
		plugins.push(terser({
			ecma: 2019,
			keep_classnames: true,
			keep_fnames: true
		}))
	} else if (`devDependencies` in packageConfig)
		external.push(...Object.keys(packageConfig.devDependencies))

	return {
		input: Object.fromEntries(
			(await findFilesPromise)
				.filter(path => path.endsWith(`.ts`) && !path.endsWith(`.d.ts`))
				.map(path => [ path.slice(sourceDirectory.length + 1, -3), path ])
		),
		output: {
			dir: `dist`,
			interop: `auto`
		},
		plugins,
		external: external.map(name => new RegExp(`^${name}(?:/|$)`)),
		preserveEntrySignatures: `allow-extension`,
		treeshake: { moduleSideEffects: false }
	}
}

/**
 * @param {string} path the directory to start recursively finding files in
 * @param {string[] | ((name: string) => boolean)} filter either a blacklist or a filter function that returns false to ignore file name
 * @param {string[]} paths
 * @returns promise that resolves to array of found files
 */
async function findFiles(path, filter = [], paths = []) {
	const filterFunction = Array.isArray(filter)
		? name => !filter.includes(name)
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
