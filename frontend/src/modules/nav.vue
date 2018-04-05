<template>
	<b-navbar id="nav" toggleable="md" type="dark">
		<b-navbar-brand href="#">
			<router-link tag="h2" :to="{name: 'Home'}">BenMarks <sup>β</sup></router-link>
		</b-navbar-brand>
		<b-navbar-nav v-for="item in menuItems" v-bind:data="item" v-bind:key="item.routeName">
			<b-nav-item :text="item.displayName"
				v-if="$route.name !== item.routeName && !$route.name.includes('Dashboard')"			
				v-on:click="$router.push({ name: item.routeName })">
				{{item.displayName}}
			</b-nav-item>
		</b-navbar-nav>
		<b-navbar-nav class="ml-auto" v-if="sessionExists">
			<b-nav-item-dropdown :text="session.user.username" right>
				<b-dropdown-item href="#" disabled>Settings - <em>coming soon</em></b-dropdown-item>
				<b-dropdown-item href="#" v-on:click="logout">Logout</b-dropdown-item>
			</b-nav-item-dropdown>
		</b-navbar-nav>
	</b-navbar>
</template> 

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'

export default {
	props: ['menuItems'],
	methods: {
		logout () {
			this.resetSession()
			this.$router.push({ name: 'Index' })
		},
		...mapMutations(['resetSession'])
	},
	computed: {
		...mapState(['session']),
		...mapGetters(['sessionExists'])
	}
}
</script>


<style>
#nav {
	box-shadow: 0 5px 20px 0 lightgrey, 0 10px 10px 0 lightgrey;	
	background-color: darkblue;
}
</style>
