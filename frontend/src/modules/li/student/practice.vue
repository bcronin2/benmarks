<template>
	<div class="container">
		<div class="row">
			<div class="page-title col">Skills practice</div>
		</div>			
		<layout-default>
			<div class="full center vertical" slot="content">
				<div v-if="$route.name === 'Practice'">
					<router-link tag="b-button" :to="{name: 'PracticeEquation'}">Equation</router-link>
				</div>
				<router-view></router-view>
			</div>
		</layout-default>
	</div>
</template>

<script>
</script>

<style src='../assets/styles.css'></style>
