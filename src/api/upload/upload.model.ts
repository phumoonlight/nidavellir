import { Request } from 'express'
import { firebaseBucket } from '../../firebase'
import { MESSAGE } from '../../const'

interface UploadResult {
  message: string
  uploadedUrl: string
}

const FOLDER = 'uploads'

const uploadFileToStorage = async (file: Express.Multer.File): Promise<string> => {
  return new Promise<string>((resolve) => {
    if (!file) return resolve('')
    const generated = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const splitedFileName = file.originalname.split('.')
    const fileExtension = splitedFileName[splitedFileName.length - 1]
    const newFileName = `u-${generated}.${fileExtension}`
    const dest = `${FOLDER}/${newFileName}`
    const blob = firebaseBucket.file(dest)
    const blobStream = blob.createWriteStream({ resumable: false })
    blobStream.on('error', (error) => {
      console.error(error)
      resolve('')
    })
    blobStream.on('finish', () => {
      const url = `https://firebasestorage.googleapis.com/v0/b/${firebaseBucket.name}/o/${FOLDER}%2F${newFileName}?alt=media`
      resolve(url)
    })
    blobStream.end(file.buffer)
  })
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
