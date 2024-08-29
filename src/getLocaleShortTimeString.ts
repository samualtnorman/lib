export const getLocaleShortTimeString = (date = new Date): string =>
	date.toLocaleString(undefined, { hour: `2-digit`, minute: `2-digit` })
