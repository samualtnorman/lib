#!/usr/bin/env node
import generate_ from "@babel/generator"
import { parse } from "@babel/parser"
import * as Babel from "@babel/types"
import { writeFile } from "fs/promises"
import * as Path from "path"
import { findFiles } from "../node_modules/@samual/lib/findFiles.js"
import TypeScript from "typescript"

const /** @type {import("@babel/generator").default} */ generate = /** @type {any} */ (generate_).default

const moduleAlias = (moduleName, alias) => Babel.declareModule(
	Babel.stringLiteral(alias),
	Babel.blockStatement([
		Babel.exportAllDeclaration(Babel.stringLiteral(moduleName)),
		Babel.exportNamedDeclaration(undefined, [ Babel.exportSpecifier(Babel.identifier("default"), Babel.identifier("default")) ], Babel.stringLiteral(moduleName))
	])
)

const host = TypeScript.createCompilerHost({})
const declarations = new Map

host.writeFile = (fileName, text) => declarations.set(
	`@samual/lib${Path.resolve(fileName).slice(process.cwd().length + "/src".length, -".d.ts".length)}`,
	text
)

TypeScript.createProgram(await findFiles("src"), {
	project: "src",
	declaration: true,
	emitDeclarationOnly: true
}, host).emit()

writeFile("dist/index.d.ts", generate(Babel.program((await Promise.all(
	[ ...declarations ].map(async ([ path, declarationFileText ]) => {
		const { body } = parse(declarationFileText, { plugins: [ "typescript" ], sourceType: "module" }).program

		for (const statement of body) {
			if ("declaration" in statement && statement.declaration && "declare" in statement.declaration)
				statement.declaration.declare = false

			if ("source" in statement && statement.source && (
				statement.source.value == "." ||
				statement.source.value == ".." ||
				statement.source.value.startsWith("./") ||
				statement.source.value.startsWith("../")
			))
				statement.source.value = Path.normalize(`${Path.dirname(path)}/${statement.source.value}`)

			if ("declare" in statement)
				statement.declare = false
		}

		const declareModule = Babel.declareModule(Babel.stringLiteral(path), Babel.blockStatement(body))
		const declareModuleJSAlias = moduleAlias(path, `${path}.js`)

		if (path.endsWith("/index"))
			return [ declareModule, declareModuleJSAlias, moduleAlias(path, path.slice(0, -"/index".length)) ]

		return [ declareModule, declareModuleJSAlias ]
	})
)).flat())).code)
