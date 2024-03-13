export const getLocaleShortTimeString = (date = new Date) =>
	date.toLocaleString(undefined, { hour: `2-digit`, minute: `2-digit` })
