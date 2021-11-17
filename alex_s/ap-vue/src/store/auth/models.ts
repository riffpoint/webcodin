import { User } from "@/servises/auth/user";
import { RootState } from "@/store";
import { ActionContext } from "vuex";

export interface State {
  loggedIn: boolean;
  user: User | null;
}

export interface Credentials {
  email: string;
  password: string;
}

export type ActionContextType = ActionContext<State, RootState>;
