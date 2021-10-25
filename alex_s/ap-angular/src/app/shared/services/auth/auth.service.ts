import { Injectable, NgZone } from '@angular/core';
import { User } from 'src/app/shared/services/auth/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertService } from '../../components/alert/alert.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  userData: any; // Save logged in user data
  authSubscribe: any;
  loading: BehaviorSubject<boolean> = new BehaviorSubject(true);

  alertOptions = {
    autoClose: false,
    keepAfterRouteChange: false
  };

  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    public alertService: AlertService
  ) {
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.authSubscribe = this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;

        localStorage.setItem('user', JSON.stringify(this.userData));
      } else {
        localStorage.setItem('user', null);
        this.router.navigate(['sign-in']);
      }

      this.loading.next(false);
    })
  }

  // Sign in with email/password
  SignIn(email, password) {
    return this.afAuth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then(() => {
      return this.afAuth.signInWithEmailAndPassword(email, password)
        .then((result) => {
          this.SetUserData(result.user, false).then(() => {
            this.ngZone.run(() => {
              this.router.navigate(['admin/dashboard']);
            });
          });
        }).catch((error) => {
          const title = {
            'auth/invalid-email': 'Email incorrect',
            'auth/user-disabled': 'User disabled',
            'auth/user-not-found': 'User not found',
            'auth/wrong-password': 'Password incorrect'
          };

          this.alertService.warn(title[error.code], error.message, this.alertOptions);
        })
    })
  }

  // Sign up with email/password
  SignUp(email, password) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign
        up and returns promise */

        this.SendVerificationMail();
        this.SetUserData(result.user, result.additionalUserInfo.isNewUser);
      }).catch((error) => {
        const title = {
          'auth/email-already-in-use': 'Email incorrect',
          'auth/invalid-email': 'Email incorrect',
          'auth/operation-not-allowed': 'Email incorrect',
          'auth/weak-password': 'Password weak'
        };

        this.alertService.warn(title[error.code], error.message, this.alertOptions);
      })
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.currentUser.then(u => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email-address']);
      })
  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail) {
    return this.afAuth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        this.alertService.warn('', 'Password reset email sent, check your inbox.', this.alertOptions);
      }).catch((error) => {
        this.alertService.warn('', error, this.alertOptions);
      })
  }

  // Change password
  ChangePassword(passwordOld, email, password) {
    return this.afAuth.signInWithEmailAndPassword(email, passwordOld)
      .then(() => {
        return this.afAuth.currentUser.then(user => {
          return user.updatePassword(password).then(() => {
            this.alertService.success('Update successful', 'New passwrod update successful', this.alertOptions);
          }).catch(error => {
            const title = {
              'auth/weak-password': 'Password weak'
            };

            this.alertService.warn(title[error.code], error.message, this.alertOptions);
          });
        });
      }).catch((error) => {
        const title = {
          'auth/invalid-email': 'Email incorrect',
          'auth/user-disabled': 'User disabled',
          'auth/user-not-found': 'User not found',
          'auth/wrong-password': 'Old Password incorrect'
        };

        this.alertService.warn(title[error.code], error.message, this.alertOptions);
      })
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user, isNewUser) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    const userData: User = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      createdAt: user.metadata.creationTime
    }

    if (isNewUser) {
      userData.roles = ['ROLE_ADMIN'];
    }

    return userRef.set(userData, {
      merge: true
    })
  }

  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['sign-in']);
    })
  }

}
