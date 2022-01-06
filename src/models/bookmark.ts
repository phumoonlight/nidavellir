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

export const initBookmarkModel = ({
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

export const initBookmarkTagModel = ({
  ownerId = '',
  title = '',
  description = '',
}: BookmarkTagPayload): BookmarkTag => ({
  owner_id: ownerId,
  description,
  title,
})