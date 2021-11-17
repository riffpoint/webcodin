import { auth, db } from "@/plugins/firebase"
import { signInWithEmailAndPassword, signOut } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import axios from "axios"

export const state = () => ({
  user: null,
})

export const mutations = {
  SET_USER (state, user) {
    state.user = user
  },
  REMOVE_USER (state) {
    state.user = null
  }
}

export const actions = {
  async getUser ({ dispatch }, uid) {
    const userRef = doc(db, "users", uid)
    const userSnap = await getDoc(userRef)
    if (userSnap.exists()) {
      dispatch('setUser', { ...userSnap.data(), uid })
    } else {
      console.log('no user', auth.currentUser)
    }
  },
  async login ({ dispatch }, userData) {
    try {
      await signInWithEmailAndPassword(auth, userData.email, userData.password)
      const token = await auth.currentUser.getIdToken()
      this.$cookies.set('access_token', token, { maxAge: (auth.currentUser.stsTokenManager.expirationTime - Date.now()) / 1000 })
      this.$cookies.set('expires_at', auth.currentUser.stsTokenManager.expirationTime - 600000)
      this.$cookies.set('refresh_token', auth.currentUser.stsTokenManager.refreshToken)
      console.log('currentUser', auth.currentUser)
      dispatch('getUser', auth.currentUser.uid)
      console.log('refreshSet')
      setTimeout(() => {
        dispatch('refreshToken')
      }, auth.currentUser.stsTokenManager.expirationTime - 600000 - Date.now())
    } catch (err) {
      throw err
    }
  },
  logout ({ commit }) {
    signOut(auth)
      .then(() => {
        commit('REMOVE_USER')
        this.$cookies.remove('access_token')
        this.$cookies.remove('expires_at')
        this.$cookies.remove('refresh_token')
      })
      .catch(err => { throw err })
      location.reload()
  },
  // refreshToken ({ dispatch }) {
    // console.log('refresh executed')
    // const refreshToken = this.$cookies.get('refresh_token')
    // let expiresIn

    // if (!refreshToken) return

    // try {
    //   const res = await axios.post('https://securetoken.googleapis.com/v1/token?key=AIzaSyDzf5Iuo21pIRGXjISINWVDvuO9n3irD4I', { grant_type: 'refresh_token', refresh_token: refreshToken })
    //   console.log('refresh data', res.data)
    //   this.$cookies.remove('access_token')
    //   this.$cookies.remove('expires_at')
    //   this.$cookies.remove('access_token')
    //   this.$cookies.set('access_token', res.data.id_token, { maxAge: Date.now() + res.data.expires_in * 1000 })
    //   this.$cookies.set('expires_at', Date.now() + ((res.data.expires_in - 600) * 1000))
    //   this.$cookies.set('access_token', res.data.refresh_token)
    //   expiresIn = res.data.expires_in

    //   setTimeout(() => {
    //     dispatch('refreshToken')
    //   }, Date.now() + ((expiresIn - 600) * 1000))
    // } catch (err) {
    //   throw err
    // }
  // },
  setUser ({ commit }, user) {
    commit('SET_USER', user)
  }
}