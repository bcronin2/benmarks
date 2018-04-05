<template>
	<div class="container">
		<div class="row">
			<div class="page-title col">Class data</div>
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
							<b-table :items="records" :fields="fields"></b-table>
						</b-tab>
					</b-tabs>
				</div>
				<div class="center vertical" v-if="records.length === 0">
					<div class="panel-title">No activity yet!</div>
					<div class="panel-text">
						Students can join using class code <b>{{session.class.code}}</b>.
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
			records: [],
			fields: []
		}
	},
	methods: {
		getRecords (param) {
			switch (param) {
			case 'equation':
				API.getClassRecordsEquation(this.session.class.id, this)
				return
			default:
				API.getClassRecordsAll(this.session.class.id, this)
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
