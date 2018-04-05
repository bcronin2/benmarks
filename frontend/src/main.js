import Vue from 'vue'
import router from './router'

import app from './app'

import { store } from './shared/store.js'

import directives from './shared/helpers/directives.js'
import templates from './shared/helpers/templates.js'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './shared/assets/styles.css'

Vue.use(directives)
Vue.use(templates)

Vue.use(BootstrapVue)

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
	if (!store.getters.sessionExists) {
		if (localStorage.getItem('session')) {
			store.commit('setSession', JSON.parse(localStorage.getItem('session')))
		}
	}
	const authed = store.getters.sessionExists
	const roled = authed ? store.state.session.user.role : null

	const authRequired = to.matched.some((route) => route.meta.auth)
	const roleRequired = to.matched.find((route) => route.meta.role > 0)
	const requiredRole = roleRequired ? roleRequired.meta.role : null
	if (authRequired && !authed) {
		next({ name: 'Index' })
		return
	}
	if (roleRequired && roled !== requiredRole) {
		next({ name: 'Home' })
		return
	}
	if (!authRequired && authed) {
		next({ name: 'Home' })
		return
	}
	next()
})

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	store,
	render: h => h(app)
})
