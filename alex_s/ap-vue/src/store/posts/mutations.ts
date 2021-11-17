import { State } from "./models";
import { Post } from "@/servises/posts/post";

export const mutations = {
  getAllSuccess(state: State, posts: Post[]): void {
    state.posts = posts;
  },
  getAllFailure(state: State): void {
    state.posts = [];
  },
};
