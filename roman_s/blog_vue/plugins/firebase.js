import { initializeApp, getApps } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDzf5Iuo21pIRGXjISINWVDvuO9n3irD4I",
  authDomain: "ssr-blog-3b669.firebaseapp.com",
  projectId: "ssr-blog-3b669",
  storageBucket: "ssr-blog-3b669.appspot.com",
  messagingSenderId: "124219159278",
  appId: "1:124219159278:web:db7e884e14efc61db139ff"
}
const apps = getApps()
let firebaseApp
if (!apps.length) {
  firebaseApp = initializeApp(firebaseConfig)
} else {
  firebaseApp = apps[0]
}

export const auth = getAuth()
export const db = getFirestore(firebaseApp, {})
