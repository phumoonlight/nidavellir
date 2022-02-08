import { RequestHandler } from 'express'
import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'
import { getAuth } from 'firebase-admin/auth'
import { ENV } from '../../env'
import bookmarkServiceAccount from '../../../serviceaccount/bookmark.json'

const APP_NAME = 'bookmark'

const bookmarkFirebaseApp = initializeApp(
	{
		credential: cert(bookmarkServiceAccount as ServiceAccount),
		storageBucket: ENV.bookmark.storageBucketName,
	},
	APP_NAME
)

export const firestore = getFirestore(bookmarkFirebaseApp)
export const firebaseBucket = getStorage(bookmarkFirebaseApp).bucket()
export const firebaseAuth = getAuth(bookmarkFirebaseApp)
