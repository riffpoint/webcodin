import { State } from "./models";
import { User } from "@/servises/auth/user";

export const mutations = {
  getAllSuccess(state: State, users: User[]): void {
    state.users = users;
  },
  getAllFailure(state: State): void {
    state.users = [];
  },
};
