export const getLocaleShortDateString = (date = new Date): string =>
	date.toLocaleString(undefined, { year: `2-digit`, month: `2-digit`, day: `2-digit` })
