const user = {
  namespaced: true,//不要修改
  state: {
    count: 0
  },
  getters: {

  },
  mutations: {
    add(state, num) {

      state.count = state.count + num
    }
  },
  actions: {
    // add({
    //   commit
    // }, num) {
    //   console.log("adddddd--asdad")
    //   commit('add', num)
    // },
    add: {
      root: true,
      handler({
        commit
      }, num) {
        commit('add', num)
      }
    }
  }
}

export default user
