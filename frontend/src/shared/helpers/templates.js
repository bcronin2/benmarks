import modal from './templates/modal'
import layoutCenter from './templates/layoutCenter'
import layout1 from './templates/layout1'
import layout2 from './templates/layout2'

export default {
	install (Vue, options) {
		Vue.component('layoutCenter', layoutCenter)
		Vue.component('layoutDefault', layout1)
		Vue.component('layoutPanels', layout2)
		Vue.component('modal', modal)
	}
}
