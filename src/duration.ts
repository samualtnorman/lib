import type { LaxPartial } from "."

export type Duration =
	LaxPartial<{ years: bigint, days: bigint, hours: bigint, minutes: bigint, seconds: bigint, milliseconds: bigint }>

export const Duration = ({ years, days, hours, minutes, seconds, milliseconds }: Partial<Duration>): Duration =>
	({ years, days, hours, minutes, seconds, milliseconds })

export function normaliseDuration(duration: Duration): void {
	let milliseconds = duration.milliseconds ?? 0n
	let seconds = duration.seconds ?? 0n
	let minutes = duration.minutes ?? 0n
	let hours = duration.hours ?? 0n
	let days = duration.days ?? 0n
	let years = duration.years ?? 0n

	seconds += milliseconds / 1000n
	milliseconds %= 1000n
	minutes += seconds / 60n
	seconds %= 60n
	hours += minutes / 60n
	minutes %= 60n
	days += hours / 24n
	hours %= 24n
	years += days / 365n
	days %= 365n

	if (duration.years != undefined)
		duration.years = years
	else
		days += years * 365n

	if (duration.days != undefined)
		duration.days = days
	else
		hours += days * 24n

	if (duration.hours != undefined)
		duration.hours = hours
	else
		minutes += hours * 60n

	if (duration.minutes != undefined)
		duration.minutes = minutes
	else
		seconds += minutes * 60n

	if (duration.seconds != undefined)
		duration.seconds = seconds
	else
		milliseconds += seconds * 1000n

	if (duration.milliseconds != undefined)
		duration.milliseconds = milliseconds
}

type FormatDurationOptions = LaxPartial<{ ignoreZero: boolean }>

export const formatDuration = (
	{ years, days, hours, minutes, seconds, milliseconds }: Duration, { ignoreZero = false }: FormatDurationOptions = {}
): string => [
	(ignoreZero ? years : years != undefined) && `${years} year${years == 1n ? `` : `s`}`,
	(ignoreZero ? days : days != undefined) && `${days} day${days == 1n ? `` : `s`}`,
	(ignoreZero ? hours : hours != undefined) && `${hours} hour${hours == 1n ? `` : `s`}`,
	(ignoreZero ? minutes : minutes != undefined) && `${minutes} minute${minutes == 1n ? `` : `s`}`,
	(ignoreZero ? seconds : seconds != undefined) && `${seconds} second${seconds == 1n ? `` : `s`}`,
	(ignoreZero ? milliseconds : milliseconds != undefined) &&
		`${milliseconds} millisecond${milliseconds == 1n ? `` : `s`}`
].filter(Boolean).join(`, `)
