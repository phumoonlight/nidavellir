const createLogger = (prefix = 'log') => {
	const formattedPrefix = `[${prefix}]`
	return (...args: any[]) => console.log(formattedPrefix, ...args)
}

const getErrorMessage = (error: any, fallbackMessage = 'error'): string => {
	if (error instanceof Error) return error.message
	return fallbackMessage
}

const initResPayload = () => ({
	code: 'success',
	message: 'success',
	success: true,
	data: null as any,
})

export const utils = {
	getErrorMessage,
	createLogger,
	initResPayload,
}
