export const user = JSON.parse(localStorage.getItem("user") || "null");

export const initialState =
  user && user.emailVerified
    ? { loggedIn: true, user: null }
    : { loggedIn: false, user: null };
