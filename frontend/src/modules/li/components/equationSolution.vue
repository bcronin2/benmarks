<template>
	<table>
		<tr>
			<td class="solution line" v-html="renderedLSide" style="text-align:right"></td>
			<td class="solution line" v-html="renderer.spc2 + '=' + renderer.spc2"></td>
			<td class="solution line" v-html="renderedRSide" style="text-align:left"></td>
		</tr>
		<tr>  
			<td class="solution line" v-html="renderedSubstitutedLSide" style="text-align:right"></td>
			<td class="solution line" v-html="renderer.spc2 + '=' + renderer.spc2"></td>
			<td class="solution line" v-html="renderedSubstitutedRSide" style="text-align:left"></td>
		</tr>
		<tr>  
			<td class="solution line" v-html="renderedEvaluatedLSide" style="text-align:right"></td>
			<td class="solution line" v-html="renderer.spc2 + '=' + renderer.spc2"></td>
			<td class="solution line" v-html="renderedEvaluatedRSide" style="text-align:left"></td>
		</tr>                          
		<tr>  
			<td class="solution line" v-html="renderedFinalLSide" style="text-align:right"></td>
			<td class="solution line" v-html="renderer.spc2 + '=' + renderer.spc2"></td>
			<td class="solution line" v-html="renderedFinalRSide" style="text-align:left"></td>
		</tr> 
	</table>
</template>

<script>
import renderer from '../helpers/renderer'

export default {
	data () {
		return {
			renderer: renderer
		}
	},
	props: ['steps', 'variable', 'solution'],
	computed: {
		renderedLSide () {
			return renderer.renderTerms(this.steps[0].lside, this.variable)
		},
		renderedRSide () {
			return renderer.renderTerms(this.steps[0].rside, this.variable)
		},
		renderedSubstitutedLSide () {
			return renderer.renderSubstitution(this.renderedLSide, this.variable, this.solution)
		},
		renderedSubstitutedRSide () {
			return renderer.renderSubstitution(this.renderedRSide, this.variable, this.solution)
		},
		renderedEvaluatedLSide () {
			return renderer.renderEvaluation(this.steps[0].lside, this.solution)
		},
		renderedEvaluatedRSide () {
			return renderer.renderEvaluation(this.steps[0].rside, this.solution)
		},
		renderedFinalLSide () {
			return renderer.renderFinal(this.steps[0].lside, this.solution)
		},
		renderedFinalRSide () {
			return renderer.renderFinal(this.steps[0].rside, this.solution)
		}
	}
}
</script>
