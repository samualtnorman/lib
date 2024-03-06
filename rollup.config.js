#!node_modules/.bin/rollup --config
import babelPresetEnv from "@babel/preset-env"
import babelPresetTypescript from "@babel/preset-typescript"
import { babel } from "@rollup/plugin-babel"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import terser from "@rollup/plugin-terser"
import { here } from "babel-plugin-here"
import { cpus } from "os"
import prettier from "rollup-plugin-prettier"
import { findFiles } from "./node_modules/@samual/lib/findFiles.js"

/** @typedef {import("rollup").RollupOptions} RollupOptions */
/** @typedef {import("@babel/preset-env").Options} BabelPresetEnvOptions */

const SOURCE_PATH = "src"

export default findFiles(SOURCE_PATH).then(foundFiles => /** @type {RollupOptions} */ ({
	input: Object.fromEntries(
		foundFiles.filter(path => path.endsWith(".ts") && !path.endsWith(".d.ts"))
			.map(path => [ path.slice(SOURCE_PATH.length + 1, -3), path ])
	),
	output: { dir: "dist" },
	plugins: [
		babel({
			babelHelpers: "bundled",
			extensions: [ ".ts" ],
			presets: [
				[ babelPresetEnv, /** @satisfies {BabelPresetEnvOptions} */({ targets: { node: "18.0" } }) ],
				babelPresetTypescript
			],
			plugins: [ here() ]
		}),
		terser({ compress: { passes: Infinity }, maxWorkers: Math.floor(cpus().length / 2), mangle: false }),
		nodeResolve({ extensions: [ ".ts" ] }),
		prettier({
			parser: "espree",
			useTabs: true,
			tabWidth: 4,
			arrowParens: "avoid",
			experimentalTernaries: true,
			printWidth: 120,
			semi: false,
			trailingComma: "none"
		})
	],
	preserveEntrySignatures: "allow-extension",
	strictDeprecations: true
}))
