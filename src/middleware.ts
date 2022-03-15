import { RequestHandler } from 'express'
import multer from 'multer'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

const uploadHandler = multer({
	storage: multer.memoryStorage(),
})

export const handleIncomingFile = uploadHandler.single('file')

export const validateIncomingFile: RequestHandler = (req, res, next) => {
	const response = {
		message: '',
		code: '',
		uploadedUrl: '',
	}
	if (!req.file) {
		res.status(422)
		response.message = 'file cannot be empty'
		response.code = 'file_empty'
		res.json(response)
		return
	}
	const fileSize = req.file?.size || 0
	if (fileSize > MAX_FILE_SIZE) {
		res.status(422)
		response.message = 'file size cannot exceed 5 mb'
		response.code = 'file_too_large'
		res.json(response)
		return
	}
	next()
}

export const middlewares = {
  handleIncomingFile,
  validateIncomingFile,
}
