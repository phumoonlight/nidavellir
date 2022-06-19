import { vurlFirebase } from '../api/vurl/vurl.firebase'
import { LinkDocument, vurlModel } from '../api/vurl/vurl.model'

const changeLinkDocId = () => {
  vurlFirebase.firestore.collection('links').get().then((snapshot) => {
    snapshot.docs.forEach(async (doc) => {
      const d = doc.data()
      await vurlModel.deleteBookmark(doc.id)
      vurlModel.createBookmark(d.uid, d as LinkDocument)
    })
  })
}
