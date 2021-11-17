import { Post } from "@/servises/posts/post";
import { RootState } from "@/store";
import { ActionContext } from "vuex";

export interface State {
  posts: Post[] | [];
}

export type ActionContextType = ActionContext<State, RootState>;
