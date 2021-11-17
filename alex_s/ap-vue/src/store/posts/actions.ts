import PostsService from "@/servises/posts";
import { ActionContextType } from "./models";
import { Post } from "@/servises/posts/post";
import GlobalService from "@/servises/global";
import store from "@/store";
import firebase from "firebase/app";

interface IPostDate {
  post: Post;
  type?: string;
  file?: File;
}

export const actions = {
  async GetAll({
    commit,
  }: ActionContextType): Promise<firebase.firestore.DocumentData> {
    const posts = await PostsService.GetAll();

    if (posts) {
      commit("getAllSuccess", posts);
      return Promise.resolve(posts);
    } else {
      commit("getAllFailure");
      return Promise.reject();
    }
  },

  async AddPost(
    context: ActionContextType,
    postData: IPostDate
  ): Promise<void> {
    const id = await PostsService.SetPostData(postData.post);

    if (postData.type === "upload" && postData.file) {
      await GlobalService.UploadImage(
        postData.file,
        id,
        "posts-images",
        "posts"
      );
    } else if (postData.type === "delete") {
      await GlobalService.DeleteImage(id, "posts-images", "posts");
    }

    return await store.dispatch("postsModule/GetAll");
  },

  async DeletePost(context: ActionContextType, id: string): Promise<void> {
    await PostsService.DeletePost(id);

    return await store.dispatch("postsModule/GetAll");
  },
};
