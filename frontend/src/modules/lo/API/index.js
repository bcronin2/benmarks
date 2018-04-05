import axios from 'axios'

const API_URL = 'http://localhost:5000/api/'
const LOGIN_URL = API_URL + 'login'
const SIGNUP_URL = API_URL + 'signup'
const JOIN_CLASS_URL = API_URL + 'class/join'

export default {

	login (creds, context, redirect) {
		axios.post(LOGIN_URL, { username: creds.username, password: creds.password })
		.then(response => {
			if (response.data.success) {
				this.startSession(response.data, context, redirect)
			}
			else {
				context.authError = response.data.error
			}
		})
		.catch(error => {
			console.log(error)
		})
	},

	signup (creds, context, redirect) {
		axios.post(SIGNUP_URL, {
			username: creds.username,
			password: creds.password,
			userRole: creds.userRole,
			classId: creds.classId })
		.then(response => {
			if (response.data.success) {
				this.startSession(response.data, context, redirect)
			}
			else {
				context.authError = response.data.error
			}
		})
		.catch(error => {
			console.log(error)
		})
	},

	checkClassCode (code, context) {
		axios.post(JOIN_CLASS_URL, { code: code	})
		.then(response => {
			if (response.data.success) {
				context.creds.classId = response.data.class_id
			}
			else {
				context.authError = true
			}
		})
		.catch(error => {
			console.log(error)
		})
	},

	startSession (data, context, redirect) {
		context.$store.commit('setSession', { user: data.user, class: data.class })
		context.$router.push(redirect)
	}
}
