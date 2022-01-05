import { Router } from 'express'
import { uploadController } from './upload'

export const apiController = Router()

apiController.use('/upload', uploadController)