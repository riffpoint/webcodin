export default function ({ store, redirect }) {
  if (store.state['auth-custom'].user) {
    redirect('/')
  }
}