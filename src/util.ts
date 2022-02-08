import { MESSAGE } from './const'

export const createLogger = (prefix = 'log') => {
	const formattedPrefix = `[${prefix}]`
	return (...args: any[]) => console.log(formattedPrefix, ...args)
}

export const checkIsMessageError = (incomingMessage: string): boolean => {
	if (incomingMessage === MESSAGE.internalServerError) return true
	return false
}
