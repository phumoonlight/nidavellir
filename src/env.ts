const {
  PORT = '4000',
  STORAGE_BUCKET_NAME = 'nidavellir-35793.appspot.com',
} = process.env

export const ENV = {
  port: +PORT,
  storageBucketName: STORAGE_BUCKET_NAME
}
