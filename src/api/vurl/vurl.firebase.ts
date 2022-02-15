import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'
import { getAuth } from 'firebase-admin/auth'
import { ENV } from '../../env'
import vurlServiceAccount from '../../../serviceaccount/vurl.json'

const APP_NAME = 'vurl'

const bookmarkFirebaseApp = initializeApp(
	{
		credential: cert(vurlServiceAccount as ServiceAccount),
		storageBucket: ENV.vurl.storageBucketName,
	},
	APP_NAME
)

export const useFirebase = () => {
	const firestore = getFirestore(bookmarkFirebaseApp)
	const bucket = getStorage(bookmarkFirebaseApp).bucket()
	const auth = getAuth(bookmarkFirebaseApp)
	return {
		firestore,
		bucket,
		auth,
	}
}
