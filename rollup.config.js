#!node_modules/.bin/rollup --config
import { babel } from "@rollup/plugin-babel"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import terser from "@rollup/plugin-terser"
import { here } from "babel-plugin-here"
import MagicString from "magic-string"
import { cpus } from "os"
import { findFiles } from "./node_modules/@samual/lib/findFiles.js"
import packageConfig from "./package.json" assert { type: "json" }

const SourceFolder = "src"
const Minify = true

const externalDependencies = []

if ("dependencies" in packageConfig)
	externalDependencies.push(...Object.keys(packageConfig.dependencies))

if ("optionalDependencies" in packageConfig)
	externalDependencies.push(...Object.keys(packageConfig.optionalDependencies))

export default findFiles(SourceFolder).then(foundFiles => /** @type {import("rollup").RollupOptions} */ ({
	input: Object.fromEntries(
		foundFiles
			.filter(path => path.endsWith(".ts") && !path.endsWith(".d.ts"))
			.map(path => [ path.slice(SourceFolder.length + 1, -3), path ])
	),
	output: { dir: "dist", chunkFileNames: "[name]-.js", generatedCode: "es2015", interop: "auto", compact: Minify },
	plugins: [
		babel({
			babelHelpers: "bundled",
			extensions: [ ".ts" ],
			presets: [
				[ "@babel/preset-env", { targets: { node: "18" } } ],
				[ "@babel/preset-typescript", { allowDeclareFields: true } ]
			],
			plugins: [ here() ]
		}),
		nodeResolve({ extensions: [ ".ts" ] }),
		Minify && terser(/** @type {Parameters<typeof terser>[0] & { maxWorkers: number }} */ ({
			keep_classnames: true,
			keep_fnames: true,
			compress: { passes: Infinity },
			maxWorkers: Math.floor(cpus().length / 2)
		})),
		{
			name: "rollup-plugin-shebang",
			renderChunk(code, { fileName }) {
				if (!fileName.startsWith("bin/"))
					return undefined

				const magicString = new MagicString(code).prepend("#!/usr/bin/env node\n")

				return { code: magicString.toString(), map: magicString.generateMap({ hires: true }) }
			}
		}
	],
	external:
		source => externalDependencies.some(dependency => source == dependency || source.startsWith(`${dependency}/`)),
	preserveEntrySignatures: "allow-extension",
	strictDeprecations: true
}))
