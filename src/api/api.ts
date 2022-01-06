import { Router } from 'express'
import { bookmarkController } from './bookmark'
import { uploadController } from './upload'

export const apiController = Router()

apiController.use('/upload', uploadController)
apiController.use('/bookmark', bookmarkController)