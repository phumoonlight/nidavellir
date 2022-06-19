import { Router } from 'express'
import { vurlAuth } from './vurl.auth'
import { vurlModel } from './vurl.model'
import { middlewares } from '../../middleware'
import { utils } from '../../utils'

export const vurlController = Router()

vurlController.get('/links', vurlAuth.handleAuth, async (req, res) => {
	const groupId = (req.query.group as string) || ''
	const userId = vurlAuth.getUserId(res)
	const data = await vurlModel.getBookmarks({ userId, groupId })
	res.json({ data })
})

vurlController.post('/links', vurlAuth.handleAuth, async (req, res) => {
	const payload = utils.initResPayload()
	const userId = vurlAuth.getUserId(res)
	const linkDocId = await vurlModel.createBookmark(userId, req.body)
	payload.data = linkDocId
	if (!linkDocId) {
		payload.code = 'failed'
		payload.message = 'failed to create link'
		payload.success = false
		res.status(500)
	}
	res.json(payload)
})

vurlController.patch('/links/:id', vurlAuth.handleAuth, async (req, res) => {
	const bookmarkId = req.params.id || ''
	const userId = vurlAuth.getUserId(res)
	const isSuccess = await vurlModel.updateBookmark(userId, bookmarkId, req.body)
	const message = isSuccess ? 'success' : 'failed'
	if (!isSuccess) res.status(500)
	res.json({ message })
})

vurlController.delete('/links/:id', vurlAuth.handleAuth, async (req, res) => {
	const isSuccess = await vurlModel.deleteBookmark(req.params.id)
	const message = isSuccess ? 'success' : 'failed'
	if (!isSuccess) res.status(500)
	res.json({ message })
})

vurlController.get('/groups', vurlAuth.handleAuth, async (req, res) => {
	const userId = vurlAuth.getUserId(res)
	const result = await vurlModel.getGroups(userId)
	if (!result.isSuccess) res.status(500)
	res.json(result)
})

vurlController.post('/groups', vurlAuth.handleAuth, async (req, res) => {
	const payload = utils.initResPayload()
	const userId = vurlAuth.getUserId(res)
	const createdGroupId = await vurlModel.createGroup(userId, req.body)
	payload.data = createdGroupId
	if (!createdGroupId) {
		payload.code = 'failed'
		payload.message = 'failed to create group'
		payload.success = false
		res.status(500)
	}
	res.json(payload)
})

vurlController.patch('/groups/:id', vurlAuth.handleAuth, async (req, res) => {
	const payload = utils.initResPayload()
	const groupId = req.params.id || ''
	const userId = vurlAuth.getUserId(res)
	const result = await vurlModel.updateGroup(userId, groupId, req.body)
	payload.success = result.isSuccess
	if (!result.isSuccess) {
		payload.code = 'failed'
		payload.message = result.message
		res.status(500)
	}
	res.json(result)
})

vurlController.delete('/groups/:id', vurlAuth.handleAuth, async (req, res) => {
	const groupId = req.params.id || ''
	const userId = vurlAuth.getUserId(res)
	const isSuccess = await vurlModel.deleteGroup({ userId, groupId })
	if (!isSuccess) res.status(500)
	res.json({
		message: isSuccess ? 'success' : 'failed',
	})
})

vurlController.post(
	'/images',
	vurlAuth.handleAuth,
	middlewares.handleIncomingFile,
	middlewares.validateIncomingFile,
	async (req, res) => {
		const payload = {
			message: 'success',
			code: 'success',
			uploadedUrl: '',
		}
		const file = req.file as Express.Multer.File
		const uploadedUrl = await vurlModel.uploadImage(file)
		payload.message = uploadedUrl ? 'success' : 'failed'
		payload.code = uploadedUrl ? 'success' : 'failed'
		payload.uploadedUrl = uploadedUrl
		res.status(payload.uploadedUrl ? 200 : 500)
		res.json(payload)
	}
)
