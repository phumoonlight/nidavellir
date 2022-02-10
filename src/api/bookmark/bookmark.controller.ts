import { Router } from 'express'
import { ResponsePayload } from '../../response'
import { useFirebaseAuth } from './bookmark.auth'
import {
	getBookmarks,
	createBookmark,
	getBookmarkTags,
	createBookmarkTag,
	updateBookmark,
	deleteBookmark,
	deleteBookmarkGroup,
} from './bookmark.model'

export const bookmarkController = Router()

bookmarkController.get('/items', useFirebaseAuth, async (req, res) => {
	const groupId = (req.query.group as string) || ''
	const ownerId = res.locals.decodedIdToken?.uid || ''
	const data = await getBookmarks({
		ownerId,
		groupId,
	})
	res.json({ data })
})

bookmarkController.post('/items', useFirebaseAuth, async (req, res) => {
	const userId = res.locals.decodedIdToken?.uid || ''
	const data = await createBookmark(userId, req)
	res.json({ data })
})

bookmarkController.put('/items/:id', useFirebaseAuth, async (req, res) => {
	const userId = res.locals.decodedIdToken?.uid || ''
	const isSuccess = await updateBookmark(userId, req)
	const message = isSuccess ? 'success' : 'failed'
	if (!isSuccess) res.status(500)
	res.json({ message })
})

bookmarkController.delete('/items/:id', useFirebaseAuth, async (req, res) => {
	const isSuccess = await deleteBookmark(req)
	const message = isSuccess ? 'success' : 'failed'
	if (!isSuccess) res.status(500)
	res.json({ message })
})

bookmarkController.get('/groups', useFirebaseAuth, async (req, res) => {
	const userId = res.locals.decodedIdToken?.uid || ''
	const data = await getBookmarkTags(userId)
	res.json({ data })
})

bookmarkController.post('/groups', useFirebaseAuth, async (req, res) => {
	const userId = res.locals.decodedIdToken?.uid || ''
	const data = await createBookmarkTag(userId, req)
	res.json({ data })
})

bookmarkController.delete('/groups/:id', useFirebaseAuth, async (req, res) => {
	const groupId = req.params.id || ''
	const userId = res.locals.decodedIdToken?.uid || ''
	const isSuccess = await deleteBookmarkGroup({ userId, groupId })
	if (!isSuccess) res.status(500)
	res.json({
		message: isSuccess ? 'success' : 'failed',
	})
})
