import { Request } from 'express'
import { firestore, firebaseAuth } from './bookmark.firebase'
import { MESSAGE } from '../../const'

export interface BookmarkItemPayload {
	tagId: string
	thumbnail: string
	title: string
	description: string
	ownerId: string
	url: string
}

export interface BookmarkTagPayload {
	ownerId: string
	title: string
	description: string
	order: number
}

export interface BookmarkItem {
	tag_id: string
	owner_id: string
	thumbnail: string
	title: string
	description: string
	url: string
}

export interface BookmarkTag {
	owner_id: string
	title: string
	description: string
	order: number
}

const mapBookmarkPayload = ({
	description = '',
	ownerId = '',
	tagId = '',
	thumbnail = '',
	title = '',
	url = '',
}: BookmarkItemPayload): BookmarkItem => ({
	owner_id: ownerId,
	tag_id: tagId,
	description,
	thumbnail,
	title,
	url,
})

const initBookmarkTagModel = ({
	ownerId = '',
	title = '',
	description = '',
	order = 0,
}: BookmarkTagPayload): BookmarkTag => ({
	owner_id: ownerId,
	description,
	title,
	order,
})

const COLLECTION = {
	items: 'bookmarks',
	tags: 'tags',
}

export const getBookmarks = async (ownerId: string) => {
	try {
		const collectionRef = firestore.collection(COLLECTION.items)
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

export const createBookmark = async (ownerId: string, req: Request) => {
	try {
		const bookmark = mapBookmarkPayload(req.body)
		bookmark.owner_id = ownerId
		const createdDocRef = await firestore
			.collection(COLLECTION.items)
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
		const targetDoc = firestore.collection(COLLECTION.items).doc(bookmarkId)
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
		const targetDoc = firestore.collection(COLLECTION.items).doc(bookmarkId)
		await targetDoc.delete()
		return true
	} catch (error) {
		console.error(error)
		return false
	}
}

export const getBookmarkTags = async (req: Request) => {
	try {
		const ownerId = req.query.owner || ''
		const collectionRef = firestore.collection(COLLECTION.tags)
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

export const createBookmarkTag = async (req: Request): Promise<string> => {
	try {
		const tag = initBookmarkTagModel(req.body)
		if (!tag.owner_id) return MESSAGE.requiredOwnerId
		await firestore.collection(COLLECTION.tags).add(tag)
		return MESSAGE.success
	} catch (error) {
		console.error(error)
		return MESSAGE.internalServerError
	}
}

export const decodeIdToken = async (token: string) => {
	try {
		const result = await firebaseAuth.verifyIdToken(token)
		return result
	} catch (error) {
		console.error(error)
		return null
	}
}
