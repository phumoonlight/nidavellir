import { Request } from 'express'
import { firestore } from './bookmark.firebase'

export interface BookmarkDocument {
	gid: string
	uid: string
	timg: string
	title: string
	url: string
	order: number
}

export interface BookmarkGroupDocument {
	uid: string
	title: string
	desc: string
	timg: string
	order: number
}

const COLLECTION = {
	bookmarks: 'bookmarks',
	bookmarkGroups: 'bookmark_groups',
}

export const getBookmarks = async ({ userId = '', groupId = '' }) => {
	try {
		const collectionRef = firestore.collection(COLLECTION.bookmarks)
		const query = collectionRef
			.where('uid', '==', userId)
			.where('gid', '==', groupId)
		const snapshot = await query.get()
		return snapshot.docs.map((doc) => ({
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

export const createBookmark = async (
	userId: string,
	payload: BookmarkDocument
) => {
	try {
		if (!userId) throw new Error('userid required')
		if (!payload.url) throw new Error('url required')
		const bookmark: BookmarkDocument = {
			uid: userId,
			url: payload.url,
			gid: payload.gid || '',
			timg: payload.timg || '',
			title: payload.title || 'untitled',
			order: payload.order || 0,
		}
		const bookmarkCollectionRef = firestore.collection(COLLECTION.bookmarks)
		const createdDocRef = await bookmarkCollectionRef.add(bookmark)
		return await createdDocRef.get()
	} catch (error) {
		console.error(error)
		return null
	}
}

export const updateBookmark = async (
	userId: string,
	bookmarkId: string,
	payload: BookmarkDocument
): Promise<boolean> => {
	try {
		if (!userId) throw new Error('userid required')
		const bookmarkCollectionRef = firestore.collection(COLLECTION.bookmarks)
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
		const bookmarkCollRef = firestore.collection(COLLECTION.bookmarks)
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
		const groupCollRef = firestore.collection(COLLECTION.bookmarkGroups)
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
	payload: BookmarkGroupDocument
) => {
	try {
		const bookmarkGroup: BookmarkGroupDocument = {
			uid: userId,
			desc: payload.desc || 'no description.',
			timg: payload.timg || '',
			title: payload.title || 'untitled',
			order: payload.order || 0,
		}
		const createdDocRef = await firestore
			.collection(COLLECTION.bookmarkGroups)
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
		const groupCollectionRef = firestore.collection(COLLECTION.bookmarks)
		const groupDocRef = groupCollectionRef.doc(groupId)
		const groupDocSnapshot = await groupDocRef.get()
		const groupDocData = groupDocSnapshot.data() as BookmarkGroupDocument
		if (groupDocData?.uid !== userId) throw new Error('user mismatch')
		await groupDocRef.delete()
		return true
	} catch (error) {
		console.error(error)
		return false
	}
}
