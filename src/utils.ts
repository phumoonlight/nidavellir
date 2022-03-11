const createLogger = (prefix = 'log') => {
	const formattedPrefix = `[${prefix}]`
	return (...args: any[]) => console.log(formattedPrefix, ...args)
}

const getErrorMessage = (error: any, fallbackMessage = 'error'): string => {
	if (error instanceof Error) return error.message
	return fallbackMessage
}

export const utils = {
	getErrorMessage,
	createLogger,
}
