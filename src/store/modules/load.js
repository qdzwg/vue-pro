//管理app.vue中loading的显示

const load = {
    namespaced: true,//不要修改,命名空间
    state: {
        
    },
    getters: {

    },
    mutations: {
        upStatus(state, flag) {
            state.isLoading = flag
        }
    },
    actions: {
        updateLoadingStatus: {
            root: true,
            handler({ commit }, flag) {
                commit('upStatus', flag)
            }
        }
    }
}

export default load
