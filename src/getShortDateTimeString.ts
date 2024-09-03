import { getShortDateString } from "./getShortDateString"
import { getShortTimeString } from "./getShortTimeString"

export const getShortDateTimeString =
	(date = new Date): string => `${getShortDateString(date)} ${getShortTimeString(date)}`
