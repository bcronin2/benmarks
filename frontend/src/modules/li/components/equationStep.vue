<template>
	<tbody id="equation-step">
		<tr v-if="step.operation.operand">
			<td class="line operation" v-html="renderedOperation" style="text-align:center"></td>
			<td class="operation"></td>
			<td class="line operation" v-html="renderedOperation" style="text-align:center"></td>
		</tr>
		<tr class="equation">
			<td class="line" v-html="renderedLSide" style="text-align:right"></td>
			<td class="line" v-html="renderer.spc2 + '=' + renderer.spc2"></td>
			<td class="line" v-html="renderedRSide" style="text-align:left"></td>
		</tr>
	</tbody>
</template>

<script>
import renderer from '../helpers/renderer'

export default {
	data () {
		return {
			renderer: renderer
		}
	},
	props: ['step', 'variable'],
	computed: {
		renderedLSide: function () {
			return renderer.renderTerms(this.step.lside, this.variable)
		},
		renderedRSide: function () {
			return renderer.renderTerms(this.step.rside, this.variable)
		},
		renderedOperation: function () {
			return renderer.renderOperation(this.step.operation, this.variable)
		}
	}
}
</script>
