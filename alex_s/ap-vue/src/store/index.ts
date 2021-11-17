import { createStore } from "vuex";
import { authModule } from "./auth";
import { usersModule } from "./users";
import { postsModule } from "./posts";

export interface RootState {
  loading: boolean;
}

export default createStore<RootState>({
  state: {
    loading: false,
  },
  mutations: {},
  actions: {},
  modules: {
    authModule,
    usersModule,
    postsModule,
  },
});
