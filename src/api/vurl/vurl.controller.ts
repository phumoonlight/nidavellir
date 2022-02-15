import { Router } from 'express'
import { useAuth } from './vurl.auth'
import { useVurlModel } from './vurl.model'

const auth = useAuth()
const model = useVurlModel()

export const vurlController = Router()

vurlController.get('/links', auth.verify, async (req, res) => {
	const groupId = (req.query.group as string) || ''
	const userId = auth.getAuthorizedUserId(res)
	const data = await model.getBookmarks({ userId, groupId })
	res.json({ data })
})

vurlController.post('/links', auth.verify, async (req, res) => {
	const userId = auth.getAuthorizedUserId(res)
	const data = await model.createBookmark(userId, req.body)
	res.json({ data })
})

vurlController.patch('/links/:id', auth.verify, async (req, res) => {
	const bookmarkId = req.params.id || ''
	const userId = auth.getAuthorizedUserId(res)
	const isSuccess = await model.updateBookmark(userId, bookmarkId, req.body)
	const message = isSuccess ? 'success' : 'failed'
	if (!isSuccess) res.status(500)
	res.json({ message })
})

vurlController.delete('/links/:id', auth.verify, async (req, res) => {
	const isSuccess = await model.deleteBookmark(req)
	const message = isSuccess ? 'success' : 'failed'
	if (!isSuccess) res.status(500)
	res.json({ message })
})

vurlController.get('/groups', auth.verify, async (req, res) => {
	const userId = auth.getAuthorizedUserId(res)
	const data = await model.getBookmarkGroups(userId)
	res.json({ data })
})

vurlController.post('/groups', auth.verify, async (req, res) => {
	const userId = auth.getAuthorizedUserId(res)
	const data = await model.createBookmarkGroup(userId, req.body)
	res.json({ data })
})

vurlController.delete('/groups/:id', auth.verify, async (req, res) => {
	const groupId = req.params.id || ''
	const userId = auth.getAuthorizedUserId(res)
	const isSuccess = await model.deleteBookmarkGroup({ userId, groupId })
	if (!isSuccess) res.status(500)
	res.json({
		message: isSuccess ? 'success' : 'failed',
	})
})
