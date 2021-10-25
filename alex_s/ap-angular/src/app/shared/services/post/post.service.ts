import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './post';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private postsCollection: AngularFirestoreCollection<Post>;
  posts: Observable<Post[]>;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth
  ) {
    this.postsCollection = afs.collection<Post>('posts');
  }

  GetAllPosts() {
    this.posts = this.postsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Post;
        const id = a.payload.doc.id;

        return { id, ...data };
      }))
    );

    return this.posts;
  }

  GetPost(id: string) {
    return this.postsCollection.doc(id).valueChanges();
  }

  DeletePost(id: string) {
    return this.postsCollection.doc(id).delete();
  }

  SetPostData(post: Post) {
    return this.afAuth.currentUser.then(user => {
      const postData: Post = {
        uid: post.uid ? post.uid : this.afs.createId(),
        title: post.title,
        excerpt: post.excerpt,
        description: post.description,
        createdAt: post.createdAt ? post.createdAt : firebase.firestore.FieldValue.serverTimestamp(),
        photoURL: post.photoURL
      };

      if (!post.uid) {
        postData.owner = user.uid;
      }

      return this.postsCollection.doc(postData.uid).set(postData, {
        merge: true
      })
    });
  }
}
