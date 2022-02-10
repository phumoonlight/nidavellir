import { Request } from 'express'
import { firestore, firebaseAuth } from './bookmark.firebase'

export interface BookmarkPayload {
	groupId: string
	ownerId: string
	thumbnailUrl: string
	title: string
	url: string
	order: number
}

export interface BookmarkGroupPayload {
	ownerId: string
	title: string
	description: string
	bgUrl: string
	order: number
}

export interface BookmarkDocument {
	group_id: string
	owner_id: string
	thumbnail_url: string
	title: string
	url: string
	order: number
}

export interface BookmarkGroupDocument {
	owner_id: string
	title: string
	description: string
	bg_url: string
	order: number
}

const COLLECTION = {
	bookmarks: 'bookmarks',
	bookmarkGroups: 'bookmark_groups',
}

const mapBookmarkPayload = ({
	ownerId = '',
	groupId = '',
	thumbnailUrl = '',
	title = '',
	url = '',
	order = 0,
}: BookmarkPayload): BookmarkDocument => ({
	owner_id: ownerId,
	group_id: groupId,
	thumbnail_url: thumbnailUrl,
	title,
	url,
	order,
})

const mapBookmarkGroupPayload = ({
	ownerId = '',
	title = '',
	description = '',
	bgUrl = '',
	order = 0,
}: BookmarkGroupPayload): BookmarkGroupDocument => ({
	owner_id: ownerId,
	bg_url: bgUrl,
	description,
	title,
	order,
})

export const getBookmarks = async ({ ownerId = '', groupId = '' }) => {
	try {
		const collectionRef = firestore.collection(COLLECTION.bookmarks)
		const query = collectionRef
			.where('owner_id', '==', ownerId)
			.where('group_id', '==', groupId)
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

export const createBookmark = async (ownerId: string, req: Request) => {
	try {
		const bookmark = mapBookmarkPayload(req.body)
		bookmark.owner_id = ownerId
		const createdDocRef = await firestore
			.collection(COLLECTION.bookmarks)
			.add(bookmark)
		return await createdDocRef.get()
	} catch (error) {
		console.error(error)
		return null
	}
}

export const updateBookmark = async (
	ownerId: string,
	req: Request
): Promise<boolean> => {
	try {
		const bookmarkId = req.params.id
		const bookmark = mapBookmarkPayload(req.body)
		bookmark.owner_id = ownerId
		const targetDoc = firestore.collection(COLLECTION.bookmarks).doc(bookmarkId)
		await targetDoc.update(bookmark)
		return true
	} catch (error) {
		console.error(error)
		return false
	}
}

export const deleteBookmark = async (req: Request): Promise<boolean> => {
	try {
		const bookmarkId = req.params.id
		const targetDoc = firestore.collection(COLLECTION.bookmarks).doc(bookmarkId)
		await targetDoc.delete()
		return true
	} catch (error) {
		console.error(error)
		return false
	}
}

export const getBookmarkTags = async (ownerId: string) => {
	try {
		const collectionRef = firestore.collection(COLLECTION.bookmarkGroups)
		const query = collectionRef.where('owner_id', '==', ownerId)
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

export const createBookmarkTag = async (ownerId: string, req: Request) => {
	try {
		const bookmarkGroup = mapBookmarkGroupPayload(req.body)
		bookmarkGroup.owner_id = ownerId
		const created = await firestore
			.collection(COLLECTION.bookmarkGroups)
			.add(bookmarkGroup)
		return await created.get()
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
		const groupDocData = groupDocSnapshot.data()
		if (groupDocData?.owner_id !== userId) throw new Error('owner mismatch')
		await groupDocRef.delete()
		return true
	} catch (error) {
		console.error(error)
		return false
	}
}
