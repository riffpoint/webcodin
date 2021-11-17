import { initialState } from "./states";
import { mutations } from "./mutations";
import { actions } from "./actions";
import { getters } from "./getters";

const postsModule = {
  namespaced: true,
  state: initialState,
  mutations: mutations,
  actions: actions,
  getters: getters,
};

export {
  postsModule,
  initialState as initialPostsState,
  mutations as postsMutations,
  actions as postsActions,
  getters as postsGetters,
};
