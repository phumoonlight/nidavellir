import { Router } from 'express'
import { getAuthorizedUserId, useFirebaseAuth } from './bookmark.auth'
import {
	getBookmarks,
	createBookmark,
	getBookmarkGroups,
	createBookmarkGroup,
	updateBookmark,
	deleteBookmark,
	deleteBookmarkGroup,
} from './bookmark.model'

export const bookmarkController = Router()

bookmarkController.get('/bookmarks', useFirebaseAuth, async (req, res) => {
	const groupId = (req.query.group as string) || ''
	const userId = getAuthorizedUserId(res)
	const data = await getBookmarks({ userId, groupId })
	res.json({ data })
})

bookmarkController.post('/bookmarks', useFirebaseAuth, async (req, res) => {
	const userId = getAuthorizedUserId(res)
	const data = await createBookmark(userId, req.body)
	res.json({ data })
})

bookmarkController.patch('/bookmarks/:id', useFirebaseAuth, async (req, res) => {
	const bookmarkId = req.params.id || ''
	const userId = getAuthorizedUserId(res)
	const isSuccess = await updateBookmark(userId, bookmarkId, req.body)
	const message = isSuccess ? 'success' : 'failed'
	if (!isSuccess) res.status(500)
	res.json({ message })
})

bookmarkController.delete('/bookmarks/:id', useFirebaseAuth, async (req, res) => {
	const isSuccess = await deleteBookmark(req)
	const message = isSuccess ? 'success' : 'failed'
	if (!isSuccess) res.status(500)
	res.json({ message })
})

bookmarkController.get('/groups', useFirebaseAuth, async (req, res) => {
	const userId = getAuthorizedUserId(res)
	const data = await getBookmarkGroups(userId)
	res.json({ data })
})

bookmarkController.post('/groups', useFirebaseAuth, async (req, res) => {
	const userId = getAuthorizedUserId(res)
	const data = await createBookmarkGroup(userId, req.body)
	res.json({ data })
})

bookmarkController.delete('/groups/:id', useFirebaseAuth, async (req, res) => {
	const groupId = req.params.id || ''
	const userId = getAuthorizedUserId(res)
	const isSuccess = await deleteBookmarkGroup({ userId, groupId })
	if (!isSuccess) res.status(500)
	res.json({
		message: isSuccess ? 'success' : 'failed',
	})
})
