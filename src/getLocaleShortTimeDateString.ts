import { getLocaleShortDateString } from "./getLocaleShortDateString"
import { getLocaleShortTimeString } from "./getLocaleShortTimeString"

export const getLocaleShortTimeDateString =
	(date = new Date): string => `${getLocaleShortDateString(date)} ${getLocaleShortTimeString(date)}`
