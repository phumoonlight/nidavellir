import { RequestHandler } from 'express'
import { initResponseData } from './upload.model'
import { MESSAGE } from '../../const'

export const validateReqFile: RequestHandler = (req, res, next) => {
  const responseData = initResponseData()
  if (!req.file) {
    res.status(422)
    responseData.message = MESSAGE.uploadedEmpty
    res.json(responseData)
    return
  }
  const fileSize = req.file?.size || 0
  if (fileSize > 5 * 1024 * 1024) {
    res.status(422)
    responseData.message = MESSAGE.uploadedSizeTooLarge
    res.json(responseData)
    return
  }
  next()
}
