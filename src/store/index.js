import { createStore } from 'vuex'

const store = createStore({
  state: {
    active_file_id: '',
  },
  mutations: {
    reset_file_id(state, file_id) {
      state.active_file_id = file_id
    },
  },
  actions: {},
  getters: {},
})

export default store
