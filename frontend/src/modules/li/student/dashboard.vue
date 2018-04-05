<template>
	<div class="container">
		<div class="row">
			<div class="page-title col">Welcome, {{session.user.username}}!</div>
		</div>
		<layout-panels>
			<div slot="panel-1-content">
				<div class="panel-title">Your progress</div>
				<div class="center vertical" v-if="studentTotal > 0">
					<div class="panel-text">
						<b>Total problems: {{studentTotal}}</b>
					</div>
					<div class="progress" v-if="session.class.id > 0">
						<div class="progress-bar" role="progressbar" v-bind:style="{width: progress + '%'}">
							class max: {{classMax}}
						</div>
					</div>
					<router-link class="center panel-text" :to="{name: 'StudentData'}">More data</router-link>
				</div>
				<div class="center panel-text" v-if="studentTotal === 0">Practice some skills!</div>
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
			studentTotal: 0,
			classMax: 0
		}
	},
	computed: {
		skills () {
			return [
				{ title: 'Solving equations', link: 'PracticeEquation' },
				{ title: 'Graphing linear equations' },
				{ title: 'Ratios' },
				{ title: 'Integer operations' },
				{ title: 'Fraction operations' }
			]
		},
		progress () {
			return 100 * (this.studentTotal / this.classMax)
		},
		...mapState(['session'])
	},
	created () {
		API.getStudentAndClassTotals(this.session.user.id, this.session.class.id, this)
	}
}
</script>

<style src="../assets/styles.css"></style>
