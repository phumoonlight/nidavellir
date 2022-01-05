import { app } from './app'
import { ENV } from './env'

const LOG_PREFIX = '[server]'

app.listen(ENV.port, () => {
	console.info(LOG_PREFIX, 'app listening at port', ENV.port)
	console.info(LOG_PREFIX, 'node version', process.version)
})
