<template>
	<layout-center>
		<div slot="panel-content">
			<div class="center panel-title">Hello!</div>
			<div class="row center">
				<router-link tag="b-button" :to="{name: 'Login'}">Log in</router-link>
				<router-link tag="b-button" :to="{name: 'Signup'}">Sign up</router-link>
			</div>
		</div>
	</layout-center>
</template>

<script>
export default {}
</script>