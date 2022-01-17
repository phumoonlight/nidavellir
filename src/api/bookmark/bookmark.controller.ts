import { Router } from 'express'
import { checkIsMessageError } from '../../util'
import {
  getBookmarks,
  createBookmark,
  getBookmarkTags,
  createBookmarkTag,
  updateBookmark,
  deleteBookmark,
} from './bookmark.model'

export const bookmarkController = Router()

bookmarkController.get('/items', async (req, res) => {
  const data = await getBookmarks(req)
  res.json({ data })
})

bookmarkController.post('/items', async (req, res) => {
  const message = await createBookmark(req)
  res.json({ message })
})

bookmarkController.put('/items/:id', async (req, res) => {
  const message = await updateBookmark(req)
  if (checkIsMessageError(message)) res.status(500)
  res.json({ message })
})

bookmarkController.delete('/items/:id', async (req, res) => {
  const message = await deleteBookmark(req)
  if (checkIsMessageError(message)) res.status(500)
  res.json({ message })
})

bookmarkController.get('/tags', async (req, res) => {
  const data = await getBookmarkTags(req)
  res.json({ data })
})

bookmarkController.post('/tags', async (req, res) => {
  const message = await createBookmarkTag(req)
  res.json({ message })
})
