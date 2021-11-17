import { State } from "./models";
import { User } from "@/servises/auth/user";

export const mutations = {
  signInSuccess(state: State, user: User): void {
    state.loggedIn = true;
    state.user = user;
  },
  signInFailure(state: State): void {
    state.loggedIn = false;
    state.user = null;
  },
  signOut(state: State): void {
    state.loggedIn = false;
    state.user = null;
  },
  signUpSuccess(state: State, user: User): void {
    state.loggedIn = false;
    state.user = user;
  },
  signUpFailure(state: State): void {
    state.loggedIn = false;
    state.user = null;
  },
  setCurrentUser(state: State, user: User): void {
    state.user = user;
  },
};
