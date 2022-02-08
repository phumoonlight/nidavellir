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
