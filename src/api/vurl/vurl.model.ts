import { Request } from 'express'
import { vurlFirebase } from './vurl.firebase'
import { utils } from '../../utils'
import { initFirebaseStorageUploader } from '../../firebase'

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

const firestore = vurlFirebase.firestore

export const getBookmarks = async ({ userId = '', groupId = '' }) => {
	try {
		const query = await firestore
			.collection(COLLECTION.links)
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

export const getGroups = async (userId: string) => {
	const result = {
		isSuccess: true,
		data: [] as any[],
	}
	try {
		const querySnapshot = await firestore
			.collection(COLLECTION.linkGroup)
			.where('uid', '==', userId)
			.get()
		result.data = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			created_at: doc.createTime.toDate(),
			updated_at: doc.updateTime.toDate(),
			...doc.data(),
		}))
	} catch (error) {
		console.error(error)
		result.isSuccess = false
	}
	return result
}

const createGroup = async (userId: string, payload: LinkGroupDocument) => {
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

export const updateGroup = async (
	userId: string,
	groupId: string,
	payload: LinkGroupDocument
) => {
	const result = {
		isSuccess: true,
		message: 'success',
	}
	try {
		if (!userId) throw new Error('uid required')
		await firestore
			.collection(COLLECTION.linkGroup)
			.doc(groupId)
			.update(payload)
	} catch (error) {
		console.error(error)
		result.isSuccess = false
		result.message = utils.getErrorMessage(error, 'failed to update group')
	}
	return result
}

export const deleteGroup = async ({ groupId = '', userId = '' }) => {
	try {
		await firestore.runTransaction(async (tx) => {
			const groupCollRef = firestore.collection(COLLECTION.linkGroup)
			const deletingGroupDoc = groupCollRef.doc(groupId)
			const linkCollRef = firestore.collection(COLLECTION.links)
			const linkQuerySnapshot = await tx.get(
				linkCollRef.where('gid', '==', groupId)
			)
			linkQuerySnapshot.docs.forEach((doc) => tx.update(doc.ref, { gid: '' }))
			tx.delete(deletingGroupDoc)
		})
		return true
	} catch (error) {
		console.error(error)
		return false
	}
}

const uploadImage = initFirebaseStorageUploader({
	bucket: vurlFirebase.bucket,
	folder: 'uploads',
	fileNamePrefix: 'u',
})

export const vurlModel = {
	getBookmarks,
	createBookmark,
	updateBookmark,
	deleteBookmark,
	getGroups,
	createGroup,
	updateGroup,
	deleteGroup,
	uploadImage
}
