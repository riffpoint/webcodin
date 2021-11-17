import firebase from "firebase/app";
import "firebase/firestore";
import { User } from "./user";

class UsersService {
  async GetAll() {
    const snapshot = await firebase.firestore().collection("users").get();

    return snapshot.docs.map((doc) => doc.data());
  }

  async SetUserData(user: User) {
    const userRef = firebase.firestore().collection("users").doc(`${user.uid}`);

    const userData = {
      name: user.name,
      surname: user.surname,
      occupation: user.occupation,
    };

    return userRef.set(userData, {
      merge: true,
    });
  }
}

export default new UsersService();
