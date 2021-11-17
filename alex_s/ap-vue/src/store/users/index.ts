import { initialState } from "./states";
import { mutations } from "./mutations";
import { actions } from "./actions";

const usersModule = {
  namespaced: true,
  state: initialState,
  mutations: mutations,
  actions: actions,
};

export {
  usersModule,
  initialState as initialUsersState,
  mutations as usersMutations,
  actions as usersActions,
};
