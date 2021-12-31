export function countHackmudCharacters(script: string) {
	return script.replace(/\/\/.*/g, ``).replace(/[ \t\n\r\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000]/g, ``).length
}

export default countHackmudCharacters
