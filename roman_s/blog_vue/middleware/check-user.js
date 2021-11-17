export default function ({ store, redirect, app }) {
  if (!store.state['auth-custom'].user) {
    redirect(app.localePath({name: 'login'}))
  }
}