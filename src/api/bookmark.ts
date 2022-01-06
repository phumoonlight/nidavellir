import { Router } from 'express'
import { getBookmarks, createBookmark, getBookmarkTags, createBookmarkTag } from '../services/bookmark'

export const bookmarkController = Router()

bookmarkController.get('/', async (req, res) => {
  const bookmarks = await getBookmarks(req)
  res.json({ bookmarks })
})

bookmarkController.post('/', async (req, res) => {
  const message = await createBookmark(req)
  res.json({ message })
})

bookmarkController.get('/tags', async (req, res) => {
  const bookmarkTags = await getBookmarkTags(req)
  res.json({ bookmarkTags })
})

bookmarkController.post('/tags', async (req, res) => {
  const message = await createBookmarkTag(req)
  res.json({ message })
})
