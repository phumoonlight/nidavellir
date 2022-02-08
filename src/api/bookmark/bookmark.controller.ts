import { Router } from 'express'
import { useFirebaseAuth } from './bookmark.auth'
import {
	getBookmarks,
	createBookmark,
	getBookmarkTags,
	createBookmarkTag,
	updateBookmark,
	deleteBookmark,
} from './bookmark.model'

export const bookmarkController = Router()

bookmarkController.get('/items', useFirebaseAuth, async (req, res) => {
	const userId = res.locals.decodedIdToken?.uid || ''
	const data = await getBookmarks(userId)
	res.json({ data })
})

bookmarkController.post('/items', useFirebaseAuth, async (req, res) => {
	const userId = res.locals.decodedIdToken?.uid || ''
	const message = await createBookmark(userId, req)
	res.json({ message })
})

bookmarkController.put('/items/:id', useFirebaseAuth, async (req, res) => {
	const userId = res.locals.decodedIdToken?.uid || ''
	const message = await updateBookmark(userId, req)
	res.json({ message })
})

bookmarkController.delete('/items/:id', useFirebaseAuth, async (req, res) => {
	const isSuccess = await deleteBookmark(req)
	const message = isSuccess ? 'success' : 'failed'
	if (!isSuccess) res.status(500)
	res.json({ message })
})

bookmarkController.get('/tags', useFirebaseAuth, async (req, res) => {
	const data = await getBookmarkTags(req)
	res.json({ data })
})

bookmarkController.post('/tags', useFirebaseAuth, async (req, res) => {
	const message = await createBookmarkTag(req)
	res.json({ message })
})
