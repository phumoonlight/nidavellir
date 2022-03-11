import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'
import { getAuth } from 'firebase-admin/auth'
import { VURL_CONFIG } from './vurl.config'
import { ENV } from '../../env'
import vurlServiceAccount from '../../../serviceaccount/vurl.json'

const bookmarkFirebaseApp = initializeApp(
	{
		credential: cert(vurlServiceAccount as ServiceAccount),
		storageBucket: ENV.vurl.storageBucketName,
	},
	VURL_CONFIG.firebaseAppName
)

const firestore = getFirestore(bookmarkFirebaseApp)
const bucket = getStorage(bookmarkFirebaseApp).bucket()
const auth = getAuth(bookmarkFirebaseApp)

export const vurlFirebase = {
	firestore,
	bucket,
	auth,
}
