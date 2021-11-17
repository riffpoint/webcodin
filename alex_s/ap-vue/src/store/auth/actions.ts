import AuthService from "@/servises/auth";
import { ActionContextType, Credentials } from "./models";

export const actions = {
  async SignIn(
    { commit }: ActionContextType,
    credentials: Credentials
  ): Promise<void> {
    const res = await AuthService.SignIn(
      credentials.email,
      credentials.password
    );
    const user = res?.data();

    if (user?.emailVerified) {
      commit("signInSuccess", user);
      return Promise.resolve();
    } else {
      commit("signInFailure");
      return Promise.reject();
    }
  },
  async SignUp(
    { commit }: ActionContextType,
    credentials: Credentials
  ): Promise<void> {
    const res = await AuthService.SignUp(
      credentials.email,
      credentials.password
    );
    const user = res?.data();

    if (res) {
      commit("signUpSuccess", user);
      return Promise.resolve();
    } else {
      commit("signUpFailure");
      return Promise.reject();
    }
  },
  async SignOut({ commit }: ActionContextType): Promise<void> {
    await AuthService.SignOut();

    commit("signOut");
    return Promise.resolve();
  },
  async GetCurrentUser(
    { commit }: ActionContextType,
    id: string
  ): Promise<void> {
    const res = await AuthService.GetUserData(id);
    const user = res.data();

    commit("setCurrentUser", user);
    return Promise.resolve();
  },
};
