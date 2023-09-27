import * as v from "valibot"
import * as Cookie from "../cookie"

export type CookieOptions<T extends v.BaseSchema> = { name: string, schema: T }
export const makeCookieOptions = <T extends v.BaseSchema>(options: CookieOptions<T>) => options

export function getCookie<
	T extends v.BaseSchema
>(cookies: Map<string, string>, options: CookieOptions<T>): v.Output<T> | undefined {
	const cookie = cookies.get(options.name)

	if (cookie) {
		const result = v.safeParse(options.schema, JSON.parse(cookie))

		if (result.success)
			return result.output

		console.error(HERE, options.name, result.issues[0])
	}
}

export const setCookie = <T extends v.BaseSchema>(options: CookieOptions<T>, value: v.Output<T>): string =>
	Cookie.setCookie(options.name, JSON.stringify(value))

export const deleteCookie = <T extends v.BaseSchema>(options: CookieOptions<T>): string =>
	Cookie.deleteCookie(options.name)
