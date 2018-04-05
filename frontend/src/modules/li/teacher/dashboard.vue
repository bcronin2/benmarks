<template>
	<div class="container">
		<div class="row">
			<div class="page-title col">Welcome, {{session.user.username}}!</div>
		</div>
		<layout-panels>
			<div slot="panel-1-content">
				<div class="panel-title">Class overview</div>
				<table class="panel-text" v-if="students.count > 0">
					<tr v-for="row in classInfo" v-bind:data="row" v-bind:key="row.heading">
						<td><b>{{row.heading}}: </b></td>
						<td>
							{{row.data}}
							<router-link v-if="row.action" :to="{name: row.action.routeName}">
								({{row.action.text}})
							</router-link>
						</td>						
					</tr>
				</table>
				<div class="center panel-text" v-if="students.count === 0">
					Invite students to join with class code {{session.class.code}}.
				</div>
			</div>
			<div slot="panel-2-content">
				<div class="panel-title">Skills</div>
				<div class="panel-text" v-for="skill in skills">
					<div v-if="!skill.link">{{skill.title}} - <em>coming soon</em></div> 
					<router-link v-if="skill.link" :to="{name: skill.link}">{{skill.title}}</router-link>
				</div>
			</div>
		</layout-panels>
	</div>
</template>

<script>
import { mapState } from 'vuex'

import API from '../API'

export default {
	data () {
		return {
			showClassCode: false,
			students: {}
		}
	},
	computed: {
		skills () {
			return [
				{ title: 'Solving equations', link: 'PreviewEquation' },
				{ title: 'Graphing linear equations' },
				{ title: 'Ratios' },
				{ title: 'Integer operations' },
				{ title: 'Fraction operations' }
			]
		},
		classInfo () {
			return [{ heading: 'Class code', data: this.session.class.code },
				{ heading: 'Total students', data: this.students.count, action: { text: 'see data', routeName: 'TeacherData' } },
				{ heading: 'Active students', data: this.students.active }]
		},
		...mapState(['session'])
	},
	created () {
		API.getClassSize(this.session.class.id, this)
	}
}
</script>

<style>
td {
	padding: 0 0.5rem 0.5rem;
}
</style>
