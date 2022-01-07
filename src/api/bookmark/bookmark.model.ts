import { Request } from 'express'
import { MESSAGE } from '../../const'
import { firestore } from '../../firebase'

export interface BookmarkItemPayload {
  tagId: string
  thumbnail: string
  title: string
  description: string
  ownerId: string
  url: string
}

export interface BookmarkTagPayload {
  ownerId: string
  title: string
  description: string
}

export interface BookmarkItem {
  tag_id: string
  owner_id: string
  thumbnail: string
  title: string
  description: string
  url: string
}

export interface BookmarkTag {
  owner_id: string
  title: string
  description: string
}

const initBookmarkModel = ({
  description = '',
  ownerId = '',
  tagId = '',
  thumbnail = '',
  title = '',
  url = '',
}: BookmarkItemPayload): BookmarkItem => ({
  owner_id: ownerId,
  tag_id: tagId,
  description,
  thumbnail,
  title,
  url
})

const initBookmarkTagModel = ({
  ownerId = '',
  title = '',
  description = '',
}: BookmarkTagPayload): BookmarkTag => ({
  owner_id: ownerId,
  description,
  title,
})

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
    if (!bookmark.owner_id) return MESSAGE.requiredOwnerId
    await firestore.collection(COLLECTION.items).add(bookmark)
    return MESSAGE.created
  } catch (error) {
    console.error(error)
    return MESSAGE.createdError
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
    if (!tag.owner_id) return MESSAGE.requiredOwnerId
    await firestore.collection(COLLECTION.tags).add(tag)
    return MESSAGE.created
  } catch (error) {
    console.error(error)
    return MESSAGE.createdError
  }
}