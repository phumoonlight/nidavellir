export const createLogger = (prefix = 'log') => {
  const formattedPrefix = `[${prefix}]`
  return (...args: any[]) => console.log(formattedPrefix, ...args)
}