<template>
	<layout-center>
		<div slot="panel-content">
			<div class="panel-title">{{ heading }}</div>
			<b-form v-if="createAccount" v-on:submit="signup">
				<b-form-group>
					<b-form-input type="text" placeholder="Create username"
						v-focus
						v-model.trim="creds.username"
						v-on:input="authError = null"
						v-on:click="authError = null"
						v-bind:class="{'invalid-reaction': authError === 0}"	
						:state="usernameState">
					</b-form-input>
				</b-form-group>
				<b-form-group>
					<b-form-input type="password" placeholder="Create password"
						v-model.trim="creds.password"
						v-on:input="authError = null"
						v-on:click="authError = null"
						v-bind:class="{'invalid-reaction': authError === 1}">
					</b-form-input>
				</b-form-group>
				<b-form-group invalid-feedback="Passwords must match!">
					<b-form-input type="password" placeholder="Re-enter password"
						v-model.trim="reentry" 
						v-on:input="reentryError = false"
						v-on:click="reentryError = false"
						v-bind:class="{'invalid-reaction': reentryError}"
						:state="reentryState">
					</b-form-input>
				</b-form-group>
				<div class="panel-links">
					<div class="panel-link">
						<b-button type="submit" variant="primary" :disabled="!submissable">Enter</b-button>
					</div>
					<div class="panel-link">
						Existing user? <router-link :to="{name: 'Login'}">Log in</router-link>
					</div>
				</div>
			</b-form>
			<div v-if="!createAccount">
				<div v-if="selectRole">
					<div class="row center">
						<b-button v-on:click="creds.userRole = 1">Teacher</b-button>
						<b-button v-on:click="creds.userRole = 2">Student</b-button>
					</div>
					<div class="row center">
						<router-link :to="{name: 'Login'}">Back to login</router-link>
					</div>
				</div>
				<div v-if="enterClassCode">
					<b-form v-on:submit="joinClass">
						<b-form-group invalid-feedback="Invalid class code">
							<b-form-input type="text" placeholder="Enter class code"
								v-focus
								v-model.trim="classCode" 
								v-bind:class="{'invalid-reaction': authError}"
								v-on:input="authError = null"
								v-on:click="authError = null"
								:state="classCodeState"></b-form-input>
						</b-form-group>
						<div class="panel-links">
							<div class="panel-link">
								<b-button type="submit" variant="primary" :disabled="classCode === ''">Join</b-button>
							</div>
							<div class="panel-link">
								<a href="#" v-on:click="creds.classId = 0">Skip</a>
							</div>
							<div class="panel-link">
								<router-link :to="{name: 'Login'}">Back to login</router-link>
							</div>
						</div>
					</b-form>
				</div>
			</div>
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
				password: '',
				userRole: -1,
				classId: -1
			},
			reentry: '',
			classCode: '',
			passwordMin: 6,
			reentryError: false,
			authError: null
		}
	},
	methods: {
		joinClass (e) {
			e.preventDefault()
			API.checkClassCode(this.classCode, this)
		},
		signup (e) {
			e.preventDefault()
			if (this.creds.password !== this.reentry) {
				this.reentryError = true
				return
			}
			API.signup(this.creds, this, { name: 'Home' }, this)
		}
	},
	computed: {
		heading () {
			return this.createAccount ? 'Sign up' : (this.selectRole ? 'Who are you?' : 'Join a class')
		},
		submissable () {
			return this.creds.username !== '' && this.creds.password !== '' && this.reentry !== ''
		},
		createAccount () {
			return (this.creds.userRole > 0 && !(this.creds.userRole === 2 && this.creds.classId < 0))
		},
		selectRole () {
			return this.creds.userRole < 0
		},
		enterClassCode () {
			return this.creds.userRole === 2 && this.creds.classId < 0
		},
		classCodeState () {
			return this.authError === true ? false : null
		},
		usernameState () {
			return this.authError === 0 ? false : null
		},
		reentryState () {
			return this.reentryError ? false : null
		}
	}
}
</script>
