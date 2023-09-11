declare const ParsedCookiesTag: unique symbol
declare const SetCookieTag: unique symbol

export type ParsedCookies = Pick<
	Map<string, string>, "get" | "entries" | "has" | "keys" | "size" | "values" | typeof Symbol.iterator
> & { [ParsedCookiesTag]: ParsedCookies }

export type SetCookie = string & { [SetCookieTag]: SetCookie }

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
export function parseCookies(cookies: string | undefined | null): ParsedCookies {
	const parsedCookies = new Map<string, string>

	if (cookies) {
		for (const cookie of cookies.split(`; `)) {
			const index = cookie.indexOf(`=`)

			if (index == -1)
				parsedCookies.set(``, decodeURIComponent(cookie))
			else {
				parsedCookies
					.set(decodeURIComponent(cookie.slice(0, index)), decodeURIComponent(cookie.slice(index + 1)))
			}
		}
	}

	return parsedCookies as any as ParsedCookies
}

/** @example
  * // client
  * const cookies = parseCookies(document.cookie)
  *
  * document.cookie = setCookie(cookies, "foo", "bar")
  *
  * @example
  * // server
  * const cookies = parseCookies(request.headers.get("cookie"))
  *
  * response.headers.set("set-cookie", setCookie(cookies, "foo", "bar")) */
export function setCookie(cookies: ParsedCookies, name: string, value: string): SetCookie {
	(cookies as any as Map<string, string>).set(name, value)

	return `${encodeURIComponent(name)}=${encodeURIComponent(value)};max-age=31536000;path=/;sameSite=lax` as SetCookie
}

/** @example
  * // client
  * const cookies = parseCookies(document.cookie)
  *
  * document.cookie = deleteCookie(cookies, "foo")
  *
  * @example
  * // server
  * const cookies = parseCookies(request.headers.get("cookie"))
  *
  * response.headers.set("set-cookie", deleteCookie(cookies, "foo")) */
function deleteCookie(cookies: ParsedCookies, name: string): SetCookie {
	(cookies as any as Map<string, string>).delete(name)

	return `${encodeURIComponent(name)}=;max-age=0;path=/;sameSite=lax` as SetCookie
}

/** @example
  * // client
  * const cookies = parseCookies(document.cookie)
  *
  * for (const setCookie of clearCookies(cookies))
  * 	document.cookie = setCookie
  *
  * @example
  * // server
  * const cookies = parseCookies(request.headers.get("cookie"))
  *
  * for (const setCookie of clearCookies(cookies))
  * 	response.headers.set("set-cookie", setCookie) */
export function* clearCookies(cookies: ParsedCookies): Iterable<SetCookie> {
	for (const name of cookies.keys())
		yield deleteCookie(cookies, name)
}
