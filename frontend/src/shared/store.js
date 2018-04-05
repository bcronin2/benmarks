import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export const store = new Vuex.Store({
	state: {
		session: {
			user: {},
			class: {}
		}
	},
	getters: {
		sessionExists: (state) => {
			return state.session && state.session.user && state.session.user.id
		}
	},
	mutations: {
		setSession (state, session) {
			state.session = session
			localStorage.setItem('session', JSON.stringify(session))
		},
		resetSession (state) {
			state.session = {}
			localStorage.removeItem('session')
		}
	}
})
