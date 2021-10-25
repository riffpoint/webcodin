import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  uploadRef: any;
  uploadTask: any;

  constructor(
    private afs: AngularFirestore,
    private afStorage: AngularFireStorage
  ) { }

  SortItems(items: Array<object>, fieldName: string, sortedBy: object): object {
    const dir = !!sortedBy[fieldName];
    const mod = dir ? -1 : 1;
    let sortedItems: Array<object>;
    let newSortedBy = this.setProperyToNull(sortedBy);
    newSortedBy[fieldName] = !dir;

    sortedItems = items.sort((a, b): any => {
      var fieldA = a[fieldName].toUpperCase();
      var fieldB = b[fieldName].toUpperCase();

      if (fieldA < fieldB) {
        return -1 * mod;
      }
      if (fieldA > fieldB) {
        return 1 * mod;
      }

      return 0;
    });

    return {
      items: sortedItems,
      sortedBy: newSortedBy
    }
  }

  UploadImage(file: File, id: string, folder: string, collection: string) {
    this.uploadRef = this.afStorage.ref(`${folder}/${id}`);

    return this.uploadTask = this.uploadRef.put(file).then(snapshot => {
      this.getDownloadUrl(snapshot, id, collection);
    })
  }

  DeleteImage(id: string, folder: string, collection: string) {
    this.uploadRef = this.afStorage.ref(`${folder}/${id}`);

    return this.uploadTask = this.uploadRef.delete().toPromise().then(() => {
      this.setImageUrl('', id, collection);
    })
  }

  FormatBytes(a, b = 2) {
    if (0 === a) return { number: 0, type: "Bytes" };

    const c = 0 > b ? 0 : b, d = Math.floor(Math.log(a) / Math.log(1024));

    return {
      number: parseFloat((a / Math.pow(1024, d)).toFixed(c)),
      type: ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d]
    }
  }

  private getDownloadUrl(snapshot, id: string, collection: string) {
    return snapshot.ref.getDownloadURL().then(url => {
      this.setImageUrl(url, id, collection);
    })
  }

  private setImageUrl(url: string, id: string, collection: string) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`${collection}/${id}`);

    const userData = {
      photoURL: url
    }

    return userRef.set(userData, {
      merge: true
    })
  }

  private setProperyToNull(obj: object) {
    let newObj = obj

    Object.keys(obj).forEach(k => {
      newObj[k] = null
    })

    return newObj
  }
}
