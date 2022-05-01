import { exec as execute_ } from "child_process"
import { readFile } from "fs/promises"
import semver from "semver"
import { promisify } from "util"

const execute = promisify(execute_)

const [ packageJSONFile, { stdout: gitGetHashStdout } ] = await Promise.all([
	readFile(`package.json`, { encoding: `utf-8` }),
	execute(`git rev-parse --short HEAD`)
])

const { stdout, stderr } = await execute(
	`npm version ${
		semver.inc(JSON.parse(packageJSONFile).version, `minor`)
	}-${
		gitGetHashStdout.trim()
	}`
)

process.stdout.write(stdout)
process.stderr.write(stderr)
