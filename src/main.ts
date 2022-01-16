import { app } from './app'
import { ENV } from './env'
import { createLogger } from './util'

const log = createLogger('server')

app.listen(ENV.port, () => {
	log('app listening at port', ENV.port)
	log('node version', process.version)
})
