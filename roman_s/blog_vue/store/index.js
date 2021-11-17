// import JWTDecode from 'jwt-decode'

// export const actions = {
//   async nuxtServerInit({ dispatch }, {req}) {
//     console.log('serverInit')
//     console.log(process.server, process.static)
//     if (process.server && process.static) return

//     const token = this.$cookies.get('access_token')
//     const expiresAt = this.$cookies.get('expires_at')

//     console.log('serverInit expires', expiresAt)
//     if (!token) return
//     if(token && expiresAt && expiresAt < Date.now()) {

//       console.log('init dispatching logout')

//       dispatch('auth-custom/logout')
//       return
//     }

//     console.log('serverInit getting user')
//     const decoded = JWTDecode(token)
//     dispatch('auth-custom/getUser', decoded.user_id)
//     setTimeout(() => {
//       dispatch('auth-custom/refreshToken')
//     }, expiresAt - Date.now())
//   }
// }