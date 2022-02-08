import dotenv from 'dotenv'

dotenv.config()

const {
	PORT = '4000',
	STORAGE_BUCKET_NAME = '',
	JWT_SECRET = '<secret>',
	BOOKMARK_STORAGE_BUCKET_NAME = '',
} = process.env

export const ENV = {
	port: +PORT,
	storageBucketName: STORAGE_BUCKET_NAME,
	jwtSecret: JWT_SECRET,
	bookmark: {
		storageBucketName: BOOKMARK_STORAGE_BUCKET_NAME,
	},
}
