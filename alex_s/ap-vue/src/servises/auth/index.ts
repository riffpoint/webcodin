import { User } from "./user";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import AlertService from "@/servises/alert";

class AuthService {
  alertOptions = {
    autoClose: false,
    keepAfterRouteChange: false,
  };

  async SignIn(email: string, password: string) {
    try {
      const res = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);

      localStorage.setItem("user", JSON.stringify(res.user));

      const user = await this.SetUserData(res.user, false);

      return user;
    } catch (e: any) {
      const title: { [key: string]: string } = {
        "auth/invalid-email": "Email incorrect",
        "auth/user-disabled": "User disabled",
        "auth/user-not-found": "User not found",
        "auth/wrong-password": "Password incorrect",
      };

      AlertService.warn(title[e.code], e.message, this.alertOptions);
    }
  }

  async SignUp(email: string, password: string) {
    try {
      const res = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      await this.SendVerificationMail();

      const user = await this.SetUserData(
        res.user,
        res && res.additionalUserInfo ? res.additionalUserInfo.isNewUser : null
      );

      return user;
    } catch (e: any) {
      const title: { [key: string]: string } = {
        "auth/email-already-in-use": "Email incorrect",
        "auth/invalid-email": "Email incorrect",
        "auth/operation-not-allowed": "Email incorrect",
        "auth/weak-password": "Password weak",
      };

      AlertService.warn(title[e.code], e.message, this.alertOptions);
    }
  }

  async SendVerificationMail() {
    const user = firebase.auth().currentUser;

    return user?.sendEmailVerification();
  }

  async SignOut() {
    try {
      return await firebase.auth().signOut();
    } catch (e: any) {
      console.log(e.message);
    }
  }

  async ForgotPassword(email: string) {
    try {
      const res = await firebase.auth().sendPasswordResetEmail(email);
      AlertService.success(
        "",
        "Password reset email sent, check your inbox.",
        this.alertOptions
      );
      return res;
    } catch (e: any) {
      AlertService.warn("", e, this.alertOptions);
      throw new Error(e.message);
    }
  }

  async ChangePassword(passwordOld: string, email: string, password: string) {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, passwordOld);

      try {
        await firebase.auth().currentUser?.updatePassword(password);

        AlertService.success(
          "Update successful",
          "New passwrod update successful",
          this.alertOptions
        );
      } catch (e: any) {
        const title: { [key: string]: string } = {
          "auth/weak-password": "Password weak",
        };

        AlertService.warn(title[e.code], e.message, this.alertOptions);
      }
      return;
    } catch (e: any) {
      const title: { [key: string]: string } = {
        "auth/invalid-email": "Email incorrect",
        "auth/user-disabled": "User disabled",
        "auth/user-not-found": "User not found",
        "auth/wrong-password": "Old Password incorrect",
      };

      AlertService.warn(title[e.code], e.message, this.alertOptions);

      throw new Error(e.message);
    }
  }

  async GetUserData(id: string | string[]) {
    try {
      return await firebase.firestore().collection("users").doc(`${id}`).get();
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async SetUserData(user: any, isNewUser: boolean | null | undefined) {
    const userRef = firebase.firestore().collection("users").doc(`${user.uid}`);

    const userData: User = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      createdAt: user.metadata.creationTime,
    };

    if (isNewUser) {
      userData.roles = ["ROLE_ADMIN"];
    }

    await userRef.set(userData, {
      merge: true,
    });

    return await userRef.get();
  }
}

export default new AuthService();
