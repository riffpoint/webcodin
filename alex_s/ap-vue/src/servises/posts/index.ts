import firebase from "firebase/app";
import "firebase/firestore";
import { Post } from "./post";

class PostsService {
  async GetAll() {
    const snapshot = await firebase.firestore().collection("posts").get();

    return snapshot.docs.map((doc) => doc.data());
  }

  async SetPostData(post: Post) {
    const user = firebase.auth().currentUser;

    const postData: Post = {
      uid: post.uid
        ? post.uid
        : firebase.firestore().collection("posts").doc().id,
      title: post.title,
      excerpt: post.excerpt,
      description: post.description,
      createdAt: post.createdAt
        ? post.createdAt
        : firebase.firestore.FieldValue.serverTimestamp(),
      photoURL: post.photoURL,
    };

    if (!post.uid) {
      postData.owner = user ? user.uid : "";
    }

    try {
      await firebase
        .firestore()
        .collection("posts")
        .doc(`${postData.uid}`)
        .set(postData, {
          merge: true,
        });

      return Promise.resolve(postData.uid);
    } catch (e: any) {
      throw new Error(e);
    }
  }

  async DeletePost(id: string) {
    try {
      return await firebase.firestore().collection("posts").doc(id).delete();
    } catch (e: any) {
      throw new Error(e);
    }
  }
}

export default new PostsService();
