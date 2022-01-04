import { initializeApp, cert, ServiceAccount, } from 'firebase-admin/app'
import { getStorage } from 'firebase-admin/storage'
import serviceAccount from '../service-account.json'

const BUCKET = 'phumo-nidavellir.appspot.com'
const FOLDER = 'uploads'

initializeApp({
	credential: cert(serviceAccount as ServiceAccount),
	storageBucket: BUCKET,
})

const getUploadedUrl = (fileName: string) => {
	return `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${FOLDER}%2F${fileName}?alt=media`
}

export const firebaseStorage = getStorage()

export const firebaseBucket = firebaseStorage.bucket()

export const uploadFile = async (file: Express.Multer.File): Promise<string> => {
	return new Promise<string>((resolve) => {
		if (!file) return resolve('')
		const generated = Date.now() + '-' + Math.round(Math.random() * 1e9)
		const splitedFileName = file.originalname.split('.')
		const fileExtension = splitedFileName[splitedFileName.length - 1]
		const newFileName = `test-${generated}.${fileExtension}`
		const dest = `${FOLDER}/${newFileName}`
		const blob = firebaseBucket.file(dest)
		const blobStream = blob.createWriteStream({ resumable: false })
		blobStream.on('error', (error) => {
			console.error(error)
			resolve('')
		})
		blobStream.on('finish', () => {
			const url = getUploadedUrl(newFileName)
			resolve(url)
		})
		blobStream.end(file.buffer)
	})
}
