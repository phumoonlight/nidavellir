import { Router } from 'express'
import { getBookmarks, createBookmark, getBookmarkTags, createBookmarkTag } from './bookmark.model'

export const bookmarkController = Router()

bookmarkController.get('/', async (req, res) => {
  const data = await getBookmarks(req)
  res.json({ data })
})

bookmarkController.post('/', async (req, res) => {
  const message = await createBookmark(req)
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
