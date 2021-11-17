import { initialState } from "./states";
import { mutations } from "./mutations";
import { actions } from "./actions";

const authModule = {
  namespaced: true,
  state: initialState,
  mutations: mutations,
  actions: actions,
};

export {
  authModule,
  initialState as initialAuthState,
  mutations as authMutations,
  actions as authActions,
};
