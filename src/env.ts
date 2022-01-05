const {
  PORT = '4000',
  STORAGE_BUCKET_NAME = 'phumo-nidavellir.appspot.com',
} = process.env

export const ENV = {
  port: +PORT,
  storageBucketName: STORAGE_BUCKET_NAME
}
