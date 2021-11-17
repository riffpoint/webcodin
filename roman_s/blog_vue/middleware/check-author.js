import { getDoc, doc } from "firebase/firestore"
import { db } from "@/plugins/firebase"

export default async function ({store, route, redirect, app}) {
  const postId = route.params.id
  const userId = store.state['auth-custom'].user.uid
  const postSnapshot = await getDoc(doc(db, 'posts', postId))
  const post = postSnapshot.data()
  const author = await getDoc(post.author)

  if (author.id !== userId) {
    return redirect(app.localePath({ name: 'post-id', params: { id: postId } }))
  }
}
