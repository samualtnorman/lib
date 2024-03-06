#!/usr/bin/env node
import { mkdirSync as makeDirectorySync, readdirSync as readDirectorySync, writeFileSync } from "fs"
import { isRecord } from "../node_modules/@samual/lib/isRecord.js"
import packageJson_ from "../package.json" assert { type: "json" }

const /** @type {import("@samual/lib").JSONValue} */ packageJson = packageJson_

delete packageJson.private
delete packageJson.scripts
delete packageJson.devDependencies

try {
	/** @type {any} */ (packageJson).bin = Object.fromEntries(
		readDirectorySync("dist/bin").map(name => [ name.slice(0, -3), `bin/${name}` ])
	)
} catch (error) {
	if (isRecord(error) && (error.syscall != "scandir" || error.code != "ENOENT" || error.path != "dist/bin"))
		throw error
}

makeDirectorySync("dist", { recursive: true })
writeFileSync("dist/package.json", JSON.stringify(packageJson, undefined, "\t"))
process.exit()
