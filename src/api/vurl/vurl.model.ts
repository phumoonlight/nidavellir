import { Request } from 'express'
import { useFirebase } from './vurl.firebase'

export interface LinkDocument {
	gid: string
	uid: string
	timg: string
	title: string
	url: string
	order: number
}

export interface LinkGroupDocument {
	uid: string
	title: string
	desc: string
	timg: string
	order: number
}

const COLLECTION = {
	links: 'links',
	linkGroup: 'link_groups',
}

const { firestore } = useFirebase()

export const getBookmarks = async ({ userId = '', groupId = '' }) => {
	try {
		const query = await firestore
			.collection(COLLECTION.linkGroup)
			.where('uid', '==', userId)
			.where('gid', '==', groupId)
			.get()
		return query.docs.map((doc) => ({
			id: doc.id,
			created_at: doc.createTime.toDate(),
			updated_at: doc.updateTime.toDate(),
			...doc.data(),
		}))
	} catch (error) {
		console.error(error)
		return []
	}
}

export const createBookmark = async (userId: string, payload: LinkDocument) => {
	try {
		if (!userId) throw new Error('userid required')
		if (!payload.url) throw new Error('url required')
		const bookmark: LinkDocument = {
			uid: userId,
			url: payload.url,
			gid: payload.gid || '',
			timg: payload.timg || '',
			title: payload.title || 'untitled',
			order: payload.order || 0,
		}
		const createdDocRef = await firestore
			.collection(COLLECTION.links)
			.add(bookmark)
		return await createdDocRef.get()
	} catch (error) {
		console.error(error)
		return null
	}
}

export const updateBookmark = async (
	userId: string,
	bookmarkId: string,
	payload: LinkDocument
): Promise<boolean> => {
	try {
		if (!userId) throw new Error('userid required')
		const bookmarkCollectionRef = firestore.collection(COLLECTION.links)
		const bookmarkDocRef = bookmarkCollectionRef.doc(bookmarkId)
		await bookmarkDocRef.update(payload)
		return true
	} catch (error) {
		console.error(error)
		return false
	}
}

export const deleteBookmark = async (req: Request): Promise<boolean> => {
	try {
		const bookmarkId = req.params.id || ''
		const bookmarkCollRef = firestore.collection(COLLECTION.links)
		const bookmarkDocRef = bookmarkCollRef.doc(bookmarkId)
		await bookmarkDocRef.delete()
		return true
	} catch (error) {
		console.error(error)
		return false
	}
}

export const getBookmarkGroups = async (userId: string) => {
	try {
		const groupCollRef = firestore.collection(COLLECTION.linkGroup)
		const query = groupCollRef.where('uid', '==', userId)
		const querySnapshot = await query.get()
		return querySnapshot.docs.map((doc) => ({
			id: doc.id,
			created_at: doc.createTime.toDate(),
			updated_at: doc.updateTime.toDate(),
			...doc.data(),
		}))
	} catch (error) {
		console.error(error)
		return []
	}
}

export const createBookmarkGroup = async (
	userId: string,
	payload: LinkGroupDocument
) => {
	try {
		const bookmarkGroup: LinkGroupDocument = {
			uid: userId,
			desc: payload.desc || 'no description.',
			timg: payload.timg || '',
			title: payload.title || 'untitled',
			order: payload.order || 0,
		}
		const createdDocRef = await firestore
			.collection(COLLECTION.linkGroup)
			.add(bookmarkGroup)
		const createdDocSnapshot = await createdDocRef.get()
		const createdDocData = createdDocSnapshot.data()
		return createdDocData
	} catch (error) {
		console.error(error)
		return null
	}
}

export const deleteBookmarkGroup = async ({ groupId = '', userId = '' }) => {
	try {
		const groupCollectionRef = firestore.collection(COLLECTION.linkGroup)
		const groupDocRef = groupCollectionRef.doc(groupId)
		const groupDocSnapshot = await groupDocRef.get()
		const groupDocData = groupDocSnapshot.data() as LinkGroupDocument
		if (groupDocData?.uid !== userId) throw new Error('user mismatch')
		await groupDocRef.delete()
		return true
	} catch (error) {
		console.error(error)
		return false
	}
}

export const useVurlModel = () => ({
	getBookmarks,
	createBookmark,
	updateBookmark,
	deleteBookmark,
	getBookmarkGroups,
	createBookmarkGroup,
	deleteBookmarkGroup,
})
