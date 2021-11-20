import fs from "fs"
import findFiles from "../dist/findFiles.js"

const { writeFile, readFile } = fs.promises

;(async () => {
	const packageConfig = JSON.parse(await readFile("package.json", { encoding: "utf-8" }))

	delete packageConfig.private
	delete packageConfig.scripts

	for (let name of await findFiles("dist")) {
		name = `.${name.slice(4)}`
		packageConfig.exports[name.slice(0, -3)] = name
	}

	await writeFile("dist/package.json", JSON.stringify(packageConfig, null, "\t"))
})()
