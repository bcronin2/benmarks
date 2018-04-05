<template>
	<div>
		<nav-bar></nav-bar>
		<router-view></router-view>
	</div>
</template>

<script>
import navBar from '../nav'

export default {
	components: {
		navBar: navBar
	}
}
</script>