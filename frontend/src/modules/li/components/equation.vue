<template>
	<div class="full center vertical">
		<table id="steps" v-if="steps.length > 0" >
			<step v-for="step in steps"
				:key="step.index"
				:step="step"
				:variable="variable">
			</step>
		</table>
		<table id="interaction" v-if="steps.length > 0">
			<tr id="operation" v-if="progress < 100">
				<td>
					<b-button size="sm" id="undo" v-show="operator === '' && steps.length > 1 && progress < 100" v-on:click="undo">undo</b-button>
				</td>
				<td>
					<b-form v-on:submit="apply" inline>
						<b-button-group>
							<b-button variant="primary" v-for="(value, key) in renderer.operators"
								:key="key"
								v-show="steps.length > 0 && progress < 100 && (operator === key || operator === '')"
								v-on:click="setOperator(key)">
								{{ value }}
							</b-button>
						</b-button-group>
						<b-input type="text" placeholder="Term" id="operand-input" 
							v-if="operator !== ''" 
							v-model="operandInput" 
							v-bind:class="{'invalid-reaction': invalidAttempt}"
							v-focus
							v-on:input="parseOperand" 
							:state="inputState">
						</b-input>
						<b-button type="submit" id="apply" size="sm" autocomplete="off"
							v-show="operator !== ''"
							v-bind:class="{inactive: operandInput === '' || invalidInput}"
							:disabled="operandInput === ''">
							✓
						</b-button>
					</b-form>
				</td>
				<td>
					<b-button id="redo" size="sm" v-show="operator === '' && stepsU.length > 0 && progress < 100" v-on:click="redo()">redo</b-button>
				</td>
			</tr>
			<tr>
				<td colspan="3" v-autoscroll>
					<div class="progress" v-show="steps.length > 0">
						<div class="progress-bar" role="progressbar" v-bind:style="{width: progress + '%'}"></div>
					</div>
				</td>
			</tr>
		</table>

		<div class="bottom">
			<b-button v-on:click="initialize()" :class="{'btn-sm': steps.length > 0, 'btn-md': steps.length === 0}">New Equation</b-button>
		</div>
		<modal v-if="showSolution">
			<div slot="header">You solved it!</div>
			<div slot="body" class="center vertical">
				<div class="solution solution-header"><b>Solution:</b> <span v-html="renderer.renderTerm(solutionTerm)"></span></div>
				<solution :steps="steps" :variable="variable" :solution="solutionTerm"></solution>
			</div>
			<div slot="footer">
				<b-button variant="primary" v-on:click="showSolution=false">Done</b-button>
			</div>
		</modal>
	</div>
</template>

<script>
import { mapState } from 'vuex'

import step from './equationStep'
import solution from './equationSolution'

import API from '../API'

import processor from '../helpers/processor'
import parser from '../helpers/parser'
import renderer from '../helpers/renderer'
import utils from '../helpers/utils'

export default {
	data () {
		return {
			stepsReqd: 0,
			undosUsed: 0,
			progress: 0,
			showSolution: false,
			solutionTerm: {},
			steps: [],
			stepsU: [],
			currentIndex: 0,
			variable: '',
			operandInput: '',
			operand: {},
			operator: '',
			invalidAttempt: false,
			renderer: renderer,
			equationId: 0,
			CONSTANTS: {
				keyCodes: { 'add': 43, 'subtract': 45, 'multiply': 42, 'divide': 47 },
				variables: ['a', 'b', 'n', 't', 'x'],
				leftCoeffs: [-15, -13, -11, -9, -7, -5, -3, -1, 1, 3, 5, 7, 9, 11, 13, 15],
				rightCoeffs: [-16, -14, -12, -10, -8, -6, -4, -2, 0, 0, 0, 0, 0, 2, 4, 6, 8, 10, 12, 14, 16],
				maxSteps: 4
			}
		}
	},
	components: {
		step: step,
		solution: solution
	},
	methods: {
		initialize () {
			this.variable = utils.randomValue(this.CONSTANTS.variables)
			this.steps = []
			this.currentIndex = 0

			var firstStep = {
				index: this.currentIndex++,
				lside: [processor.makeTerm(1, utils.randomValue(this.CONSTANTS.leftCoeffs), 1),
					processor.makeTerm(0, utils.randomValue(this.CONSTANTS.leftCoeffs), 1)],
				rside: [processor.makeTerm(1, utils.randomValue(this.CONSTANTS.rightCoeffs), 1),
					processor.makeTerm(0, utils.randomValue(this.CONSTANTS.rightCoeffs), 1)],
				operation: {}
			}
			this.steps.push(firstStep)
			this.stepsU = []
			this.stepsReqd = this.stepsRemaining()
			this.refresh()

			this.listen()
			API.startEquation(this.session.user.id, this.stepsReqd, this.session.class.id || 0, this)
		},
		apply (e) {
			e.preventDefault()
			this.invalidAttempt = this.invalidInput
			if (!this.invalidAttempt) {
				var nextStep = {
					index: this.currentIndex++,
					lside: processor.combineTerms(this.steps[this.steps.length - 1].lside, this.operand, this.operator),
					rside: processor.combineTerms(this.steps[this.steps.length - 1].rside, this.operand, this.operator),
					operation: processor.makeOperation(this.operator, this.operand)
				}
				this.steps.push(nextStep)
				this.refresh()
			}
		},
		undo () {
			if (this.steps.length > 0) {
				this.stepsU.push(this.steps.pop())
				this.refresh()
				this.undosUsed++
			}
		},
		redo () {
			if (this.stepsU.length > 0) {
				this.steps.push(this.stepsU.pop())
				this.refresh()
			}
		},
		clearUndo () {
			this.stepsU = []
		},
		refresh () {
			this.operand = {}
			this.operator = ''
			this.progress = (1 - (this.stepsRemaining() / this.stepsReqd)) * 100
			if (this.progress === 100) {
				this.unlisten()
				API.finishEquation(this.equationId, this.steps.length - 1, this.undosUsed, this)
				var that = this
				setTimeout(function () {
					that.getSolution()
					that.showSolution = true
				}, 1000)
			}
		},
		parseOperand () {
			this.invalidAttempt = false
			this.operand = parser.parseInput(this.operandInput, this.variable)
		},
		setOperator (value) {
			if (this.operator !== '') {
				this.resetOperator()
			}
			else {
				this.operator = value
				this.operandInput = ''
			}
			this.invalidAttempt = false
		},
		resetOperator (name) {
			this.operator = ''
		},
		getSolution () {
			if (this.progress !== 100) {
				return
			}
			var finalStep = this.steps[this.steps.length - 1]
			finalStep.lside.some(function (term) {
				if (term.degree !== 0 && term.numerator !== 0) {
					this.solutionTerm = {}
					return true
				}
				if (term.degree === 0) {
					this.solutionTerm = term
				}
			}, this)
			if (this.solutionTerm.numerator === undefined || this.solutionTerm.numerator === 0) {
				finalStep.rside.some(function (term) {
					if (term.degree === 0) {
						this.solutionTerm = term
						return true
					}
				}, this)
			}
		},
		stepsRemaining () {
			var numSteps = 0
			var coeffs = processor.getCoefficients(this.steps[this.steps.length - 1])

			// has been made into a nonlinear equation
			if (coeffs[0].length > 2 || coeffs[1].length > 2) {
				return this.CONSTANTS.maxSteps
			}

			if (Math.abs(coeffs[0][1] - coeffs[1][1]) === 1) {
				if (coeffs[0][1] === 1 || coeffs[1][1] === 1) {
					if (coeffs[0][0] * coeffs[0][1] === 0 && coeffs[1][0] * coeffs[1][1] === 0) {
						return 0
					}
					else {
						return 1
					}
				}
				if (coeffs[0][1] > coeffs[1][1] && coeffs[0][0] * coeffs[0][1] === 0) {
					return 1
				}
				if (coeffs[1][1] > coeffs[0][1] && coeffs[1][0] * coeffs[1][1] === 0) {
					return 1
				}
				return 2
			}

			// only one side has variable?
			if (coeffs[0][1] * coeffs[1][1] === 0) {
				numSteps += (coeffs[0][1] + coeffs[1][1] === 1) ? 0 : 1
			}
			else {
				numSteps += 2
			}

			// only one side has constant?
			if (coeffs[0][0] * coeffs[1][0] === 0) {
				// only one side has variable?
				if (coeffs[0][1] * coeffs[1][1] === 0) {
					numSteps += (coeffs[0][0] * coeffs[0][1] === 0 && coeffs[1][1] * coeffs[1][0] === 0) ? 0 : 1
				}
			}
			else numSteps += 1

			return numSteps
		},
		listen () {
			var that = this
			window.addEventListener('keypress', function (e) {
				if (that.operator === '') {
					if (e.which === that.CONSTANTS.keyCodes.add) {
						e.preventDefault()
						that.setOperator('add')
					}
					else if (e.which === that.CONSTANTS.keyCodes.subtract) {
						e.preventDefault()
						that.setOperator('subtract')
					}
					else if (e.which === that.CONSTANTS.keyCodes.multiply) {
						e.preventDefault()
						that.setOperator('multiply')
					}
					else if (e.which === that.CONSTANTS.keyCodes.divide) {
						e.preventDefault()
						that.setOperator('divide')
					}
				}
			})
		},
		unlisten () {
			window.removeEventListener('keypress', this.listener)
		}
	},
	computed: {
		invalidInput () {
			return (this.operandInput.length > 0 && !parser.validateInput(this.operandInput, this.variable))
		},
		inputState () {
			return this.invalidInput ? false : null
		},
		...mapState(['session'])
	},
	created () {
		this.initialize()
	}
}
</script>
