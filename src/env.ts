import dotenv from 'dotenv'

dotenv.config()

const {
  PORT = '4000',
  STORAGE_BUCKET_NAME = '',
} = process.env

export const ENV = {
  port: +PORT,
  storageBucketName: STORAGE_BUCKET_NAME
}
