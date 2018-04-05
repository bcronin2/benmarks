<template>
	<layout-center>
		<div slot="panel-content">
			<div class="panel-title">Log in</div>
			<b-form v-on:submit="login">
				<b-form-group invalid-feedback="User does not exist!">
					<b-form-input type="text" placeholder="Username"
						v-focus
						v-model.trim="creds.username"
						v-on:input="authError = null"
						v-on:click="authError = null"
						v-bind:class="{'invalid-reaction': authError === 0}"	
						:state="usernameState">
					</b-form-input>
				</b-form-group>
				<b-form-group invalid-feedback="Invalid password!">
					<b-form-input type="password" placeholder="Password"
						v-model.trim="creds.password"
						v-on:input="authError = null"
						v-on:click="authError = null"
						v-bind:class="{'invalid-reaction': authError === 1}"
						:state="passwordState">
					</b-form-input>
				</b-form-group>
				<div class="panel-links">
					<div class="panel-link">
						<b-button type="submit" variant="primary" :disabled="creds.username === ''">Enter</b-button>
					</div>
					<div class="panel-link">
						New? <router-link :to="{name: 'Signup'}">Sign up!</router-link>
					</div>
				</div>
			</b-form>
		</div>
	</layout-center>
</template>

<script>
import API from './API'

export default {
	data () {
		return {
			creds: {
				username: '',
				password: ''
			},
			authError: null
		}
	},
	methods: {
		login (e) {
			e.preventDefault()
			API.login(this.creds, this, { name: 'Home' })
		}
	},
	computed: {
		usernameState () {
			return this.authError === 0 ? false : null
		},
		passwordState () {
			return this.authError === 1 ? false : null
		}
	}
}
</script>
