import { app } from './app'
import { ENV } from './env'
import { utils } from './utils'

const log = utils.createLogger('server')

app.listen(ENV.port, () => {
	log('app listening at port', ENV.port)
	log('node version', process.version)
})
