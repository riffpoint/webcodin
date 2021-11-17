import { User } from "@/servises/auth/user";
import { RootState } from "@/store";
import { ActionContext } from "vuex";

export interface State {
  users: User[] | [];
}

export type ActionContextType = ActionContext<State, RootState>;
