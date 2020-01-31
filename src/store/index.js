import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import user from './modules/user'
import load from "./modules/load"
import traffic from './modules/traffic.js'
Vue.use(Vuex)

const store = new Vuex.Store({
    plugins: [createPersistedState({
        key: 'lotsWap',
        reducer (val) {
            return {
                traffic: val.traffic
            }
        }
    })],
    state: {
        isLoading: false,
        count: 0,
        token: "11",
        pageNoScroll: false,//页面不能滚动
    },
    mutations: {
        setPageNoScrollMutations(state, flag) {
            state.pageNoScroll = flag
        },
        setTokenMutations(state, token) {
            state.token = token
        },
        add(state, n) {
            state.count += n
        },
        loaddingChange(state, flag) {
            state.isLoading = flag
        }
    },
    getters: {
        count(state) {
            state.count += 100
            return state.count
        }
    },
    actions: {
        setPageNoScroll({ commit }, flag) {
            commit('setPageNoScrollMutations', flag)
        },
        loaddingChangeAction({ commit }, flag) {
            commit('loaddingChange', flag)
        },
        addAction(context) {
            console.log("1231312")
            context.commit('add', 10)
        },
        setTokenAction({ commit }, token) {
            commit('setTokenMutations', token)
        }
    },
    modules: {
        user,
        load,
        traffic
    }
})

export default store
