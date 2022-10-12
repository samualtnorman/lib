import { readFile, writeFile } from "fs/promises"

const packageConfig = JSON.parse(await readFile(`package.json`, { encoding: `utf-8` }))

delete packageConfig.private
delete packageConfig.scripts
writeFile(`dist/package.json`, JSON.stringify(packageConfig, undefined, `\t`))
