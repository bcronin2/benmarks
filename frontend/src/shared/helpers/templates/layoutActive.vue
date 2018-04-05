<template>
	<div class="container">
		<div class="row">
			<div class="page-title col">
				<slot name="title"></slot>
			</div>
		</div>
		<div class="row">
			<div class="col-xs-2 col-md-1 side-content"></div>
			<div class="col-xs-8 col-md-10">
				<div class="panel">
					<slot name="main-content"></slot>
				</div>
			</div>
			<div class="col-xs-2 col-md-1 side-content"></div>
		</div>
	</div>
</template>
