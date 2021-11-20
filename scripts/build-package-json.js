import fs from "fs"
import findFiles from "../dist/findFiles.js"

const { writeFile, readFile } = fs.promises

;(async () => {
	const packageConfig = JSON.parse(await readFile("package.json", { encoding: "utf-8" }))

	delete packageConfig.private
	delete packageConfig.scripts

	for (let name of await findFiles("dist")) {
		if (!name.endsWith(".d.ts"))
			continue

		name = `.${name.slice(4, -5)}`

		const nameWithExtension = `${name}.js`

		packageConfig.exports[name] = nameWithExtension

		if (name != "./index" && name.endsWith("/index"))
			packageConfig.exports[name.slice(0, -6)] = nameWithExtension
	}

	await writeFile("dist/package.json", JSON.stringify(packageConfig, null, "\t"))
})()
