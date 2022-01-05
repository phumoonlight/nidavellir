import express from 'express'
import multer from 'multer'
import { uploadFile } from '../firebase'

const uploadHandler = multer({
  storage: multer.memoryStorage(),
})

const initResponseData = () => ({
  code: 201,
  message: 'uploaded',
  uploadedUrl: '',
})

const validateReqFile: express.RequestHandler = (req, res, next) => {
  const responseData = initResponseData()
  if (!req.file) {
    res.status(422)
    responseData.code = 4002
    responseData.message = 'file cannot be empty'
    res.json(responseData)
    return
  }
  const fileSize = req.file?.size || 0
  if (fileSize > 5 * 1024 * 1024) {
    res.status(422)
    responseData.code = 4001
    responseData.message = 'maximum 5 mb allowed'
    res.json(responseData)
    return
  }
  next()
}

export const uploadController = express.Router()

uploadController.post('/', uploadHandler.single('file'), validateReqFile, async (req, res) => {
  const responseData = initResponseData()
  const uploadedUrl = await uploadFile(req.file as Express.Multer.File)
  if (!uploadedUrl) {
    res.status(500)
    responseData.code = 500
    responseData.message = 'failed to upload'
    res.json(responseData)
    return
  }
  responseData.uploadedUrl = uploadedUrl
  res.status(201)
  res.json(responseData)
})
