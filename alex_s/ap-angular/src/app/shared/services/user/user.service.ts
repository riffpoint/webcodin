import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersCollection: AngularFirestoreCollection<User>;
  users: Observable<User[]>;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth
  ) {
    this.usersCollection = afs.collection<User>('users');
  }

  GetAllUsers(): Observable<User[]> {
    this.users = this.usersCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as User;
        const id = a.payload.doc.id;

        return { id, ...data };
      }))
    );

    return this.users;
  }

  GetUser(id: string): Observable<unknown> {
    return this.usersCollection.doc(id).valueChanges();
  }

  SetUserData(user: User): Promise<void> {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    const userData = {
      name: user.name,
      surname: user.surname,
      occupation: user.occupation
    };

    return userRef.set(userData, {
      merge: true
    });
  }
}
