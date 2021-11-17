import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import { User } from "@/servises/users/user";
import { Post } from "@/servises/posts/post";

class GlobalService {
  SortItems(items: User[] | Post[], fieldName: string, sortedBy: any): any {
    const dir = !!sortedBy[fieldName];
    const mod = dir ? -1 : 1;
    let sortedItems = [];
    const newSortedBy = this.setProperyToNull(sortedBy);
    newSortedBy[fieldName] = !dir;

    sortedItems = items.sort((a: any, b: any): any => {
      const fieldA = a[fieldName] ? a[fieldName].toUpperCase() : "";
      const fieldB = b[fieldName] ? b[fieldName].toUpperCase() : "";

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
      sortedBy: newSortedBy,
    };
  }

  FormatBytes(a: number, b = 2) {
    if (0 === a) return { number: 0, type: "Bytes" };

    const c = 0 > b ? 0 : b,
      d = Math.floor(Math.log(a) / Math.log(1024));

    return {
      number: parseFloat((a / Math.pow(1024, d)).toFixed(c)),
      type: ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d],
    };
  }

  async UploadImage(
    file: File,
    id: string,
    folder: string,
    collection: string
  ) {
    const uploadRef = firebase.storage().ref(`${folder}/${id}`);

    const res = await uploadRef.put(file);
    return await this.getDownloadUrl(res, id, collection);
  }

  async DeleteImage(id: string, folder: string, collection: string) {
    const uploadRef = firebase.storage().ref(`${folder}/${id}`);

    await uploadRef.delete();
    return await this.setImageUrl("", id, collection);
  }

  private async getDownloadUrl(
    snapshot: firebase.storage.UploadTaskSnapshot,
    id: string,
    collection: string
  ) {
    const url = await snapshot.ref.getDownloadURL();
    return await this.setImageUrl(url, id, collection);
  }

  private async setImageUrl(url: string, id: string, collection: string) {
    const userRef = firebase.firestore().collection(collection).doc(id);

    const userData = {
      photoURL: url,
    };

    return await userRef.set(userData, {
      merge: true,
    });
  }

  private setProperyToNull(obj: any) {
    const newObj = obj;

    Object.keys(obj).forEach((k) => {
      newObj[k] = null;
    });

    return newObj;
  }
}

export default new GlobalService();
