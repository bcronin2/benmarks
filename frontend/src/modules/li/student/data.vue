<template>
	<div class="container">
		<div class="row">
			<div class="page-title col">Your data</div>
		</div>
		<layout-default>
			<div slot="content">
				<div v-if="records.length > 0">
					<b-tabs>
						<b-tab v-for="tab in tabs" 
							v-bind:data="tab"
							v-bind:key="tab.name"
							v-on:click="getRecords(tab.param)"							
							:title="tab.name" 
							:active="tab.name === 'Summary'">
							<b-table stacked :items="records"></b-table>
						</b-tab>
					</b-tabs>
				</div>
				<div class="center vertical" v-if="records.length === 0">
					<div class="panel-title">No data yet</div>
					<div class="panel-text">
						Try some practicing some skills!
					</div>
				</div>
			</div>
		</layout-default>
	</div>
</template>

<script>
import { mapState } from 'vuex'

import API from '../API'

export default {
	data () {
		return {
			tabs: [{ name: 'Summary', param: 'all' }, { name: 'Equations', param: 'equation' }],
			records: []
		}
	},
	methods: {
		getRecords (param) {
			switch (param) {
			case 'equation':
				API.getStudentRecordsEquation(this.session.user.id, this)
				return
			default:
				API.getStudentRecordsAll(this.session.user.id, this)
			}
		}
	},
	computed: {
		...mapState(['session'])
	},
	created () {
		this.getRecords('all')
	}
}
</script>
