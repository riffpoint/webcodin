import UsersService from "@/servises/users";
import GlobalService from "@/servises/global";
import { ActionContextType } from "./models";
import { User } from "@/servises/users/user";
import store from "@/store";
import { usersModule } from "@/store/users/index";
import { authModule } from "@/store/auth/";
import firebase from "firebase/app";

interface IUserDate {
  user: User;
  type?: string;
  file?: File;
}

export const actions = {
  async GetAll({
    commit,
  }: ActionContextType): Promise<firebase.firestore.DocumentData> {
    const users = await UsersService.GetAll();

    if (users) {
      commit("getAllSuccess", users);
      return Promise.resolve(users);
    } else {
      commit("getAllFailure");
      return Promise.reject();
    }
  },

  async EditUser(
    context: ActionContextType,
    userDate: IUserDate
  ): Promise<void> {
    await UsersService.SetUserData(userDate.user);

    if (userDate.type === "upload" && userDate.file) {
      await GlobalService.UploadImage(
        userDate.file,
        userDate.user.uid,
        "avatars",
        "users"
      );
    } else if (userDate.type === "delete") {
      await GlobalService.DeleteImage(userDate.user.uid, "avatars", "users");
    }

    await store.dispatch("usersModule/GetAll");

    const newUser = usersModule.state.users.filter(
      (user: User) => user.uid === userDate.user.uid
    );

    const currentUser = authModule.state.user! as User;

    if (currentUser.uid === userDate.user.uid) {
      store.commit("authModule/setCurrentUser", newUser[0]);
    }

    return;
  },
};
