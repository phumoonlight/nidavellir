import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'
import { ENV } from './env'
import serviceAccount from '../service-account.json'

const BUCKET = ENV.storageBucketName

initializeApp({
	credential: cert(serviceAccount as ServiceAccount),
	storageBucket: BUCKET,
})

export const firestore = getFirestore()

export const firebaseStorage = getStorage()

export const firebaseBucket = firebaseStorage.bucket()
