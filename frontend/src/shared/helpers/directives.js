export default {
	install (Vue, options) {
		Vue.directive('focus', {
			inserted (el) {
				el.focus()
			}
		})

		Vue.directive('autoscroll', {
			componentUpdated (el, binding) {
				el.scrollIntoView({ behavior: 'smooth' })
			}
		})
	}
}
