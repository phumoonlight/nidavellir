import express from 'express'
import multer from 'multer'
import { validateReqFile } from './upload.validator'
import { initResponseData, uploadFile } from './upload.model'

const uploadHandler = multer({
  storage: multer.memoryStorage(),
})

export const uploadController = express.Router()

uploadController.post('/', uploadHandler.single('file'), validateReqFile, async (req, res) => {
  const uploadedResult = await uploadFile(req)
  const responseData = initResponseData()
  responseData.message = uploadedResult.message
  responseData.uploadedUrl = uploadedResult.uploadedUrl
  if (responseData.message.includes('error')) {
    res.status(500)
    res.json(responseData)
    return
  }
  res.json(responseData)
})
