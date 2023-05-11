import { createStore } from 'vuex'

const store = createStore({
  state: {
    active_file_id: null,
    inputLoading: false,
  },

  mutations: {
    reset_file_id(state, file_id) {
      state.active_file_id = file_id
    },
    reset_loading(state, isLoading) {
      state.isLoading = isLoading
    },
  },
  actions: {},
  getters: {},
})

export default store
