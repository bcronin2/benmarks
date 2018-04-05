<template></template>

<script>
import { mapState } from 'vuex'

export default {
	computed: {
		...mapState(['session'])
	},
	created () {
		if (this.session.user.role === 1) {
			this.$router.replace({ name: 'Teacher' })
		}
		else if (this.session.user.role === 2) {
			this.$router.replace({ name: 'Student' })
		}
	}
}
</script>
