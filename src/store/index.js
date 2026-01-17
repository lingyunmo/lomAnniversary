import { createStore } from 'vuex'
import {isTokenExpired} from "../api/utils.js";

const store = createStore({
    state() {
        return {
            token: localStorage.getItem('token') || null,
        }
    },
    mutations: {
        setToken(state, token) {
            state.token = token
            localStorage.setItem('token', token)
        },
        clearToken(state) {
            state.token = null
            localStorage.removeItem('token')
        }
    },
    actions: {
        checkTokenValidity({ commit, state }) {
            if (isTokenExpired(state.token)) {
                commit('clearToken');  // 如果 token 过期，移除 token
                // 这里可以触发路由跳转到登录页面
            }
        },
    },
    getters: {
        isLoggedIn(state) {
            return !!state.token
        },
        id(state) {
            if (!state.token) return ''
            try {
                const payload = JSON.parse(atob(state.token.split('.')[1]))
                return payload.id || ''
            } catch {
                return ''
            }
        },
        username(state) {
            if (!state.token) return ''
            try {
                const payload = JSON.parse(atob(state.token.split('.')[1]))
                return payload.username || ''
            } catch {
                return ''
            }
        },
        isAdmin(state) {
            if (!state.token) return false
            try {
                const payload = JSON.parse(atob(state.token.split('.')[1]))
                return payload.is_admin || false
            } catch {
                return false
            }
        },
    }
})

export default store