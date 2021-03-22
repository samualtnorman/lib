import { exec } from "child_process"

export function bufferToString(bufferU8View: Uint8Array) {
    const offset = 1 - (bufferU8View.length % 2)
    const u8View = new Uint8Array(bufferU8View.length + offset + 1)

    u8View[0] = offset
    u8View.set(bufferU8View, offset + 1)

    return String.fromCharCode(...new Uint16Array(u8View.buffer))
}

export function stringToBuffer(string: string) {
    const u8View = new Uint8Array(new Uint16Array(string.split("").map(char => char.charCodeAt(0))).buffer)
    return new Uint8Array(u8View.buffer, u8View[0] + 1)
}

export function runCommand(command: string) {
	return new Promise<string>((resolve, reject) => {
		exec(command, (error, stdout) => {
			if (error)
				return reject(error)

			resolve(stdout)
		})
	})
}
