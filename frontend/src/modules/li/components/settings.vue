<template>
	<div class="center vertical">
		<table>
			<tr v-for="(value, key) in settings">
				<td style="text-align:right"><b>{{key}}: </b></td>
				<td style="text-align:left">{{value}}</td>
				<td><b-button size="sm">✎</b-button></td>
			</tr>
		</table>
	</div>
</template> 

<script>
import { mapState, mapMutations } from 'vuex'

export default {
	methods: {
		...mapMutations(['setSession'])
	},
	computed: {
		settings () {
			return { Username: this.session.user.username, Password: '**********' }
		},
		...mapState(['session'])
	}
}
</script>

<style>
td {
	padding: 0.5rem;
}
</style>
