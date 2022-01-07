import { Router } from 'express'
import { bookmarkController } from './bookmark/bookmark.controller'
import { uploadController } from './upload/upload.controller'

export const apiController = Router()

apiController.use('/upload', uploadController)
apiController.use('/bookmark', bookmarkController)