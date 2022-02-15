import { Router } from 'express'
import { vurlController } from './vurl/vurl.controller'
import { uploadController } from './upload/upload.controller'

export const apiController = Router()

apiController.use('/upload', uploadController)
apiController.use('/vurl', vurlController)
