import { getLocaleShortDateString } from "./getLocaleShortDateString"
import { getLocaleShortTimeString } from "./getLocaleShortTimeString"

export const getLocaleShortTimeDateString =
	(date = new Date) => `${getLocaleShortDateString(date)} ${getLocaleShortTimeString(date)}`
