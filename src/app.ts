import express from 'express'
import multer from 'multer'
import { uploadFile } from './firebase'

const uploadHandler = multer({
	storage: multer.memoryStorage(),
})

export const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/images', express.static('images'))

app.get('/favicon.ico', (req, res) => {
	res.status(204)
	res.end()
})

app.get('/', (req, res) => {
	res.send('OK')
})

app.post('/upload', uploadHandler.single('avatar'), async (req, res) => {
	const responseData = {
		code: 1,
		message: 'uploaded',
		uploadedUrl: '',
	}
	const fileSize = req.file?.size || 0
	if (fileSize > 5 * 1024 * 1024) {
		res.status(422)
		responseData.code = 40001
		responseData.message = 'maximum 5 mb allowed'
		res.json(responseData)
		return
	}
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
