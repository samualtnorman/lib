import { tryThen } from "./tryThen"

export const encodeString = (string: string) =>
	btoa(string).replaceAll(`=`, ``).replaceAll(`+`, `*`).replaceAll(`/`, `-`)

export const decodeString = (string: string) => atob(string.replaceAll(`*`, `+`).replaceAll(`-`, `/`))

/** @example
  * // client
  * const cookies = parseCookies(document.cookie)
  *
  * cookies.get("foo") // "bar"
  *
  * @example
  * // server
  * const cookies = parseCookies(request.headers.get("cookie"))
  *
  * cookies.get("foo") // "bar" */
export function parseCookies(cookies: string | undefined | null): Map<string, string> {
	const parsedCookies = new Map<string, string>

	if (cookies) {
		for (const cookie of cookies.split(`; `)) {
			const index = cookie.indexOf(`=`)

			if (index == -1)
				tryThen(() => decodeString(cookie), value => parsedCookies.set(``, value))
			else {
				tryThen(
					() => [ decodeString(cookie.slice(0, index)), decodeString(cookie.slice(index + 1)) ],
					([ key, value ]) => parsedCookies.set(key, value)
				)
			}
		}
	}

	return parsedCookies
}

/** @example
  * // client
  * document.cookie = setCookie("foo", "bar")
  *
  * @example
  * // server
  * response.headers.set("set-cookie", setCookie("foo", "bar")) */
export const setCookie = (name: string, value: string, cookieOptions: `;${string}` = `;max-age=31536000;path=/;sameSite=lax`): string =>
	`${encodeString(name)}=${encodeString(value)}${cookieOptions}`

/** @example
  * // client
  * document.cookie = deleteCookie("foo")
  *
  * @example
  * // server
  * response.headers.set("set-cookie", deleteCookie("foo")) */
export const deleteCookie = (name: string): string => `${encodeString(name)}=;max-age=0;path=/;sameSite=lax`

/** @example
  * // client
  * const cookies = parseCookies(document.cookie)
  *
  * for (const value of clearCookies(cookies))
  * 	document.cookie = value
  *
  * @example
  * // server
  * const cookies = parseCookies(request.headers.get("cookie"))
  *
  * for (const value of clearCookies(cookies))
  * 	response.headers.set("set-cookie", value) */
export function* clearCookies(parsedCookies: Map<string, string>): Iterable<string> {
	for (const name of parsedCookies.keys())
		yield deleteCookie(name)
}
