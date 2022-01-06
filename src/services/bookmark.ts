import { Request } from 'express'
import { firestore } from '../firebase'
import { initBookmarkModel, initBookmarkTagModel } from '../models/bookmark'

const COLLECTION = {
  items: 'bookmark_items',
  tags: 'bookmark_tags'
}

export const getBookmarks = async (req: Request) => {
  try {
    const ownerId = req.query.owner || ''
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

export const createBookmark = async (req: Request): Promise<string> => {
  try {
    const bookmark = initBookmarkModel(req.body)
    if (!bookmark.owner_id) return 'error: required field [ownerId]'
    await firestore.collection(COLLECTION.items).add(bookmark)
    return 'created'
  } catch (error) {
    console.error(error)
    return 'error: failed to created'
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
    if (!tag.owner_id) return 'error: required field [ownerId]'
    await firestore.collection(COLLECTION.tags).add(tag)
    return 'created'
  } catch (error) {
    console.error(error)
    return 'error: failed to created'
  }
}