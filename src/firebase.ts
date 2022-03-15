import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'
import { ENV } from './env'
import mainServiceAccount from '../serviceaccount/nidavellir.json'

initializeApp({
	credential: cert(mainServiceAccount as ServiceAccount),
	storageBucket: ENV.storageBucketName,
})

const storage = getStorage()
export const firestore = getFirestore()
export const firebaseBucket = storage.bucket()

export const initFirebaseStorageUploader = ({
	folder,
	bucket,
	fileNamePrefix = 'u',
}: {
	folder: string
	bucket: typeof firebaseBucket
	fileNamePrefix?: string
}) => {
	return async (file: Express.Multer.File): Promise<string> => {
		return new Promise<string>((resolve) => {
			if (!file) return resolve('')
			const bucketName = bucket.name
			const randomizedNumber = Math.round(Math.random() * 1e9)
			const generated = `${randomizedNumber}-${Date.now()}`
			const splitedFileName = file.originalname.split('.')
			const fileExtension = splitedFileName[splitedFileName.length - 1]
			const newFileName = `${fileNamePrefix}-${generated}.${fileExtension}`
			const newFilePath = `${folder}/${newFileName}`
			const blob = bucket.file(newFilePath)
			const blobStream = blob.createWriteStream({ resumable: false })
			blobStream.on('error', (error) => {
				console.error(error)
				resolve('')
			})
			blobStream.on('finish', () => {
				const url = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${folder}%2F${newFileName}?alt=media`
				resolve(url)
			})
			blobStream.end(file.buffer)
		})
	}
}
