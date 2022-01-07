import { Request } from 'express'
import { uploadFile as uploadFileToStorage } from '../../firebase'
import { MESSAGE } from '../../const'

interface UploadResult {
  message: string
  uploadedUrl: string
}

export const initResponseData = () => ({
  message: MESSAGE.uploaded,
  uploadedUrl: '',
})

export const uploadFile = async (req: Request): Promise<UploadResult> => {
  const result: UploadResult = {
    message: MESSAGE.uploaded,
    uploadedUrl: ''
  }
  const file = req.file as Express.Multer.File
  result.uploadedUrl = await uploadFileToStorage(file)
  if (!result.uploadedUrl) result.message = MESSAGE.uploadedError
  return result
}