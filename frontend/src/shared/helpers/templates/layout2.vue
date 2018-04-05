<template>
	<div class="row">
		<div class="col-6">
			<div class="panel">
				<slot name="panel-1-content"></slot>
			</div>
		</div>
		<div class="col-6">
			<div class="panel">
				<slot name="panel-2-content"></slot>
			</div>
		</div>
	</div>
</template>

<style>
.panel {
	height: 100%;
}
</style>
