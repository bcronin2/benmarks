<template>
	<transition name="modal">
		<div class="modal-mask">
			<div class="modal-container">
				<div class="modal-header">
					<slot name="header"></slot>
				</div>
				<div class="modal-body">
					<slot name="body"></slot>
				</div>
				<div class="modal-footer">
					<slot name="footer">
					</slot>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
export default {}
</script>

<style>
	.modal-mask {
		display: flex;
		align-content: center;
		align-items: center;
		justify-content: center;
		position: fixed;
		z-index: 10000;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, .5);
		transition: opacity .3s ease;
	}

	.modal-container {
		background-color: #fff;
		border-radius: 2px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, .33);        
		display: inline-block;
		max-width: 720px;
		min-width: 360px;
		padding: 0.5rem 1.5rem;
		transition: all .3s ease;
	}

	.modal-header {
		font-size: 1.5rem;
	}

	.modal-footer > div {
/*		margin-left: auto;
		margin-right: auto;*/
	}

	  /*
	   * The following styles are auto-applied to elements with
	   * transition="modal" when their visibility is toggled
	   * by Vue.js.
	   *
	   * You can easily play with the modal transition by editing
	   * these styles.
	   */

	.modal-enter {
		opacity: 0;
	}

	.modal-leave-active {
		opacity: 0;
	}

	.modal-enter .modal-container,
	.modal-leave-active .modal-container {
		-webkit-transform: scale(1.1);
		transform: scale(1.1);
	}
</style>