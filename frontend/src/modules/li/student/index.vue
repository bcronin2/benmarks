<template>
	<div v-if="sessionExists">
		<nav-bar :menuItems="menuItems"></nav-bar>
		<router-view></router-view>
	</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import navBar from '../../nav'

export default {
	data () {
		return {
			menuItems: [{ displayName: 'Data', routeName: 'StudentData' }]
		}
	},
	components: {
		navBar: navBar
	},
	computed: {
		...mapState(['session']),
		...mapGetters(['sessionExists'])
	}
}
</script>
