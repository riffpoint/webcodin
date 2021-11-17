import { State } from "./models";
import { Post } from "@/servises/posts/post";

export const getters = {
  getPost:
    (state: State) =>
    (id: string): Post | undefined => {
      return state.posts.find((post) => post.uid === id);
    },
};
