export const state = () => {
  return {
    activeRequests: []
  }
}

export const mutations = {
  SET_ACTIVE_REQUEST (state, request) {
    state.activeRequests.push(request)
  },
  CLEAR_ACTIVE_REQUEST (state, id) {
    const i = state.activeRequests.findIndex(el => el.id === id)
    state.activeRequests.splice(i, 1)
  },
  CLEAR_REQUESTS (state) {
    state.activeRequests = []
  }
}

export const actions = {
  addRequest ({ commit }, req) {
    commit('SET_ACTIVE_REQUEST', req)
  },
  removeRequest ({ commit }, id) {
    commit('CLEAR_ACTIVE_REQUEST', id)
  },
  publishRequest({ state }, id) {

  },
  clearRequests ({ commit }) {
    commit('CLEAR_REQUESTS')
  }
}

export const getters = {
  getRequestById: (state) => (id) => {
    return state.activeRequests.find(req => req.id === id)
  }
}
