import { app } from './app'
import { ENV } from './env'

app.listen(ENV.port, () => {
	console.info(`[server] listening at port ${ENV.port}`)
})
