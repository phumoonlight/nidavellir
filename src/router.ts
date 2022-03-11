import { Router } from 'express'
import { vurlController } from './api/vurl/vurl.controller'
import { uploadController } from './api/upload/upload.controller'

export const apiRouter = Router()

apiRouter.use('/upload', uploadController)
apiRouter.use('/vurl', vurlController)
